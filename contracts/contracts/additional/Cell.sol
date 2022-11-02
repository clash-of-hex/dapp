pragma ever-solidity >= 0.62.0;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "locklift/src/console.sol";

import '../abstract/OwnableExternal.sol';
import '../libraries/MsgFlag.sol';
import '../libraries/Errors.sol';
import '../utils/HexUtils.sol';
import '../utils/Types.sol';

import '../additional/Cell.sol';
import '../interfaces/IRouter.sol';
import '../interfaces/ICell.sol';

contract Cell is OwnableExternal, ICell {

    uint128 constant CELL_DEPLOY_VALUE = 1.0 ever;
    uint128 constant CELL_STEP_VALUE   = 1.0 ever;
    
    Types.CubeCoord static _coord;
    
    uint128[] _costPerLevel      = [uint128(1000), uint128(1500), uint128(2000), uint128(2500), uint128(3000)];
    uint128[] _energyPerLevel    = [uint128(50),   uint128(60),   uint128(70),   uint128(80),   uint128(90)  ];
    uint128[] _energyPerLevelMax = [uint128(2000), uint128(3000), uint128(4000), uint128(5000), uint128(6000)];
   
    address private _router; // admin
    uint128 private _level; // 
    uint128 private _energy; // 
    uint128 private _lastCalcTime;
    
    Types.Color private _color; // 

    constructor(
        address router,
        uint256 ownerPubkey, // marked cell user
        Types.Color color,
        uint128 energy
    ) OwnableExternal (
        ownerPubkey
    ) public {
        require(router.value != 0, 100);
        _router = router;
        _color = color;
        _energy = energy;
        _lastCalcTime = now;
        _level = 0;
    }

    function getRouter() public view returns (address router) {
        return _router;
    }

    function getDetails() public view returns (
        Types.CubeCoord coord,
        Types.Color color,
        uint128 level,
        uint128 energy,
        uint128 energySec,
        uint128 energyMax,
        uint128 lastCalcTime,
        uint128 nowCalcTime,
        uint256 owner) {
        return ( 
            _coord,
            _color,
            _level,
            calculateEnergy(),
            _energyPerLevel[_level],
            _energyPerLevelMax[_level],
            now,
            now,
            getOwner()
        );
    }

    function calculateEnergy() public view returns (uint128 energy) {
        energy = _energy;
        if (energy >= _energyPerLevelMax[_level]) {
            return energy;
        }
        energy = math.min(energy + _energyPerLevel[_level] * (now - _lastCalcTime), _energyPerLevelMax[_level]); 
    }

//////////////////////////////////
    function startProcess(uint128 energyP, uint128 energyM) internal {
        _energy = calculateEnergy() + energyP - energyM;
        _lastCalcTime = now;
    }


////////////////////////////////// MARK CELL
    function markCell(
        Types.CubeCoord targetCoord,
        uint128 energy
    ) public onlyOwner {
        require(msg.value > CELL_STEP_VALUE + CELL_DEPLOY_VALUE, Errors.LOW_GAS_VALUE);
        require(energy >= _costPerLevel[0] && energy <= calculateEnergy(), Errors.NOT_ENOUGH_ENERGY);
        require(HexUtils.isCorrectCoord(targetCoord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(_coord, targetCoord) == true, Errors.WRONG_COORD);
        tvm.accept();
        startProcess(0, energy);
        IRouter(_router)._newCell{
            value: 0 ton,
            flag: MsgFlag.REMAINING_GAS
        }(_coord, targetCoord, _color, energy - _costPerLevel[0]);
        console.log(format("markCell {}", "OK"));
    }
    
////////////////////////////////// HELP CELL
    function helpCell(
        Types.CubeCoord targetCoord,
        uint128 energy
    ) public onlyOwner {
        require(msg.value > CELL_STEP_VALUE*2, Errors.LOW_GAS_VALUE);
        require(energy <= calculateEnergy(), Errors.NOT_ENOUGH_ENERGY);
        require(HexUtils.isCorrectCoord(targetCoord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(_coord, targetCoord) == true, Errors.WRONG_COORD);
        tvm.accept();
        startProcess(0, energy);
        ICell(_resolveCell(targetCoord))._helpCell{
            value: 0 ton,
            flag: MsgFlag.REMAINING_GAS
        }(_coord, _color, energy);
        console.log(format("helpCell {}", "OK"));
    }

    function _helpCell(
        Types.CubeCoord coord,
        Types.Color color,
        uint128 energy
    ) override external onlyOwner {
        require(msg.value > CELL_STEP_VALUE, Errors.LOW_GAS_VALUE);
        require(msg.sender == _resolveCell(coord), Errors.WRONG_ADDRESS);
        require(HexUtils.isCorrectCoord(coord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(_coord, coord) == true, Errors.WRONG_COORD);
        tvm.accept();
        startProcess(energy, 0);
        console.log(format("_helpCell {}", "OK"));
    }
    
    
////////////////////////////////// ATTK CELL
    function attkCell(
        Types.CubeCoord targetCoord,
        uint128 energy
    ) public onlyOwner {
        require(msg.value > CELL_STEP_VALUE*2, Errors.LOW_GAS_VALUE);
        require(energy <= calculateEnergy(), Errors.NOT_ENOUGH_ENERGY);
        require(HexUtils.isCorrectCoord(targetCoord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(_coord, targetCoord) == true, Errors.WRONG_COORD);
        tvm.accept();
        startProcess(0, energy);
        ICell(_resolveCell(targetCoord))._attkCell{
            value: 0 ton,
            flag: MsgFlag.REMAINING_GAS
        }(_coord, _color, energy);
        console.log(format("attkCell {}", "OK"));
    }

    function _attkCell(
        Types.CubeCoord coord,
        Types.Color color,
        uint128 energy
    ) override external onlyOwner {
        require(msg.value > CELL_STEP_VALUE, Errors.LOW_GAS_VALUE);
        require(msg.sender == _resolveCell(coord), Errors.WRONG_ADDRESS);
        require(HexUtils.isCorrectCoord(coord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(_coord, coord) == true, Errors.WRONG_COORD);
        tvm.accept();
        uint128 energyTemp = calculateEnergy();
        if (energy <= energyTemp) {
          startProcess(0, energy);
        } else {
          _transferOwnership(msg.pubkey());
          _color = color;
          startProcess(energy, energyTemp);
        }
        console.log(format("_attkCell {}", "OK"));
    }

////////////////////////////////// ATTK CELL
    function upgradeCell(
    ) public onlyOwner {
        require(msg.value > CELL_STEP_VALUE, Errors.LOW_GAS_VALUE);
        require(_costPerLevel[_level+1] <= calculateEnergy(), Errors.NOT_ENOUGH_ENERGY);
        tvm.accept();
        startProcess(0, _costPerLevel[_level+1]);
        _level++;
        console.log(format("upgradeCell {}", "OK"));
    }
////////////////////////////////////

    function _resolveCell(
        Types.CubeCoord coord
    ) public view returns (address cellAddress) {
        TvmCell code = _buildCellCode(_router);
        TvmCell state = _buildCellState(code, coord);
        uint256 hashState = tvm.hash(state);
        cellAddress = address.makeAddrStd(address(this).wid, hashState);
        console.log(format("resolveCell 2 {}", cellAddress));
    }

    function _buildCellCode(address router) internal view returns (TvmCell) {
        TvmBuilder salt;
        salt.store(router);
        return tvm.setCodeSalt(tvm.code(), salt.toCell());
    }

    function _buildCellState(
        TvmCell code,
        Types.CubeCoord coord
    ) internal pure returns (TvmCell) {
        return tvm.buildStateInit({
            contr: Cell,
            varInit: { _coord: coord },
            code: code
        });
    }

}