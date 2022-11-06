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
    uint128 constant ACTION_VALUE   = 0.2 ever;
    
    Types.CubeCoord static _coord;
    
    uint64[] _costPerLevel      = [uint64(1000), uint64(1500), uint64(2000), uint64(2500), uint64(3000)];
    uint64[] _energyPerLevel    = [uint64(1),    uint64(2),    uint64(3),    uint64(4),    uint64(5)  ];
    uint64[] _energyPerLevelMax = [uint64(2000), uint64(3000), uint64(4000), uint64(5000), uint64(6000)];
   
    address private _router; // admin
    uint64 private _speed;
    uint64 private _level; // 
    uint64 private _energy; // 
    uint128 private _lastCalcTime;
    uint128 private _endTime;
    
    Types.Color private _color; // 

    constructor(
        address router,
        uint256 ownerPubkey, // marked cell user
        uint128 endTime,
        uint64 speed,
        Types.Color color,
        uint64 energy
    ) OwnableExternal (
        ownerPubkey
    ) public {
        require(address(this).balance > CELL_DEPLOY_VALUE, Errors.NOT_ENOUGH_BALANCE);
        tvm.accept();
        _router = router;
        _endTime = endTime;
        _speed = speed;
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
        uint64 level,
        uint64 speed,
        uint128 endTime,
        uint64 energy,
        uint64 energySec,
        uint64 energyMax,
        uint128 lastCalcTime,
        uint256 owner) {
        return ( 
            _coord,
            _color,
            _level,
            _speed,
            _endTime,
            calculateEnergy(),
            _energyPerLevel[_level],
            _energyPerLevelMax[_level],
            now,
            getOwner()
        );
    }

    function calculateEnergy() public view returns (uint64 energy) {
        energy = _energy;
        if (energy >= _energyPerLevelMax[_level]) {
            return energy;
        }
        energy = math.min(energy + _energyPerLevel[_level] * _speed * uint64(now - _lastCalcTime), _energyPerLevelMax[_level]); 
    }

//////////////////////////////////
    function startProcess(uint64 energyP, uint64 energyM) internal {
        _energy = calculateEnergy() + energyP - energyM;
        _lastCalcTime = now;
    }


////////////////////////////////// MARK CELL
    function markCell(
        address sendGasTo,
        Types.CubeCoord targetCoord,
        uint64 energy
    ) public onlyOwner {
        require(now < _endTime, Errors.TIME_IS_OVER);
        require(msg.value > CELL_DEPLOY_VALUE + ACTION_VALUE, Errors.LOW_GAS_VALUE);
        require(energy >= _costPerLevel[0] && energy <= calculateEnergy(), Errors.NOT_ENOUGH_ENERGY);
        require(HexUtils.isCorrectCoord(targetCoord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(_coord, targetCoord) == true, Errors.WRONG_COORD);
        tvm.rawReserve(0, 4); 
        startProcess(0, energy);
        IRouter(_router)._newCell{
            value: 0 ton,
            flag: MsgFlag.ALL_NOT_RESERVED
        }(sendGasTo, _coord, targetCoord, _color, energy - _costPerLevel[0]);
    }
    
////////////////////////////////// HELP CELL
    function helpCell(
        address sendGasTo,
        Types.CubeCoord targetCoord,
        uint64 energy
    ) public onlyOwner {
        require(now < _endTime, Errors.TIME_IS_OVER);
        require(msg.value > ACTION_VALUE*2, Errors.LOW_GAS_VALUE);
        require(energy <= calculateEnergy(), Errors.NOT_ENOUGH_ENERGY);
        require(HexUtils.isCorrectCoord(targetCoord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(_coord, targetCoord) == true, Errors.WRONG_COORD);
        tvm.rawReserve(0, 4); 
        startProcess(0, energy);
        ICell(_resolveCell(targetCoord))._helpCell{
            value: 0 ton,
            flag: MsgFlag.ALL_NOT_RESERVED
        }(sendGasTo, _coord, _color, energy);
    }

    function _helpCell(
        address sendGasTo,
        Types.CubeCoord coord,
        Types.Color color,
        uint64 energy
    ) override external onlyOwner {
        require(msg.value > ACTION_VALUE, Errors.LOW_GAS_VALUE);
        require(msg.sender == _resolveCell(coord), Errors.WRONG_ADDRESS);
        require(HexUtils.isCorrectCoord(coord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(_coord, coord) == true, Errors.WRONG_COORD);
        tvm.rawReserve(0, 4); 
        startProcess(energy, 0);
        sendGasTo.transfer({value: 0, flag: MsgFlag.ALL_NOT_RESERVED + MsgFlag.IGNORE_ERRORS, bounce: false}); 
    }
    
    
////////////////////////////////// ATTK CELL
    function attkCell(
        address sendGasTo,
        Types.CubeCoord targetCoord,
        uint64 energy
    ) public onlyOwner {
        require(now < _endTime, Errors.TIME_IS_OVER);
        require(msg.value > ACTION_VALUE*2, Errors.LOW_GAS_VALUE);
        require(energy <= calculateEnergy(), Errors.NOT_ENOUGH_ENERGY);
        require(HexUtils.isCorrectCoord(targetCoord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(_coord, targetCoord) == true, Errors.WRONG_COORD);
        tvm.rawReserve(0, 4); 
        startProcess(0, energy);
        ICell(_resolveCell(targetCoord))._attkCell{
            value: 0 ton,
            flag: MsgFlag.ALL_NOT_RESERVED
        }(sendGasTo, _coord, _color, energy);
    }

    function _attkCell(
        address sendGasTo,
        Types.CubeCoord coord,
        Types.Color color,
        uint64 energy
    ) override external onlyOwner {
        require(msg.value > ACTION_VALUE, Errors.LOW_GAS_VALUE);
        require(msg.sender == _resolveCell(coord), Errors.WRONG_ADDRESS);
        require(HexUtils.isCorrectCoord(coord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(_coord, coord) == true, Errors.WRONG_COORD);
        tvm.rawReserve(0, 4); 
        uint64 energyTemp = calculateEnergy();
        if (energy <= energyTemp) {
          startProcess(0, energy);
        } else {
          _transferOwnership(msg.pubkey());
          _color = color;
          startProcess(energy - energyTemp, energyTemp);
        }
        sendGasTo.transfer({value: 0, flag: MsgFlag.ALL_NOT_RESERVED + MsgFlag.IGNORE_ERRORS, bounce: false}); 
    }

////////////////////////////////// ATTK CELL
    function upgradeCell(
        address sendGasTo
    ) public onlyOwner {
        require(now < _endTime, Errors.TIME_IS_OVER);
        require(msg.value > ACTION_VALUE, Errors.LOW_GAS_VALUE);
        require(_costPerLevel[_level+1] <= calculateEnergy(), Errors.NOT_ENOUGH_ENERGY);
        tvm.rawReserve(0, 4); 
        startProcess(0, _costPerLevel[_level+1]);
        _level++;
        console.log(format("upgradeCell {}", "OK"));
        sendGasTo.transfer({value: 0, flag: MsgFlag.ALL_NOT_RESERVED + MsgFlag.IGNORE_ERRORS, bounce: false}); 
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