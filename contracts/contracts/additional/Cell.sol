pragma ever-solidity >= 0.62.0;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

// import "locklift/src/console.sol";

import '../libraries/MsgFlag.sol';
import '../libraries/Errors.sol';
import '../utils/HexUtils.sol';
import '../utils/Types.sol';

import '../additional/Cell.sol';
import '../interfaces/IRouter.sol';
import '../interfaces/ICell.sol';

contract Cell is ICell {

    uint128 constant CELL_DEPLOY_VALUE = 1.0 ever;
    uint128 constant ACTION_VALUE   = 0.2 ever;
    
    Types.CubeCoord static _coord;
    
    uint64[] _costPerLevel    = [uint64(4000),  uint64(3000), uint64(3000) ];
    uint64[] _maxEPerLevel    = [uint64(5000),  uint64(7000), uint64(10000)];
    uint64[] _farmPerLevel    = [uint64(20),    uint64(35),   uint64(50)   ];
    uint64 _deboost = 20;
   
    address private _router; // admin
    
    modifier onlyRouter() {
        require(_router == msg.sender, 100);
        _;
    }    

    address private _owner; // user
    
    modifier onlyOwner() {
        require(_owner == msg.sender, 100);
        _;
    }    

    uint64 private _speed;
    uint64 private _level; // 
    uint64 private _energy; // 
    uint128 private _lastCalcTime;
    uint128 private _endTime;
    
    Types.Color private _color; // 

    constructor(
        address router,
        address owner, // marked cell user
        uint128 endTime,
        uint64 speed,
        Types.Color color,
        uint64 energy
    ) public {
        require(address(this).balance > CELL_DEPLOY_VALUE, Errors.NOT_ENOUGH_BALANCE);
        tvm.accept();
        _router = router;
        _owner = owner;
        _endTime = endTime;
        _speed = speed;
        _color = color;
        _energy = energy + 0;
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
        address owner) {
        return ( 
            _coord,
            _color,
            _level,
            _speed,
            _endTime,
            calculateEnergy(),
            _farmPerLevel[_level],
            _maxEPerLevel[_level],
            now,
            _owner
        );
    }

    function calculateEnergy() public view returns (uint64 energy) {
        energy = _energy;
        uint64 _energyMax = _maxEPerLevel[_level];
        if (energy > _energyMax) {
          uint64 val = _deboost * _speed * uint64(now - _lastCalcTime);
          if (energy - _energyMax > val) {
            energy = energy - val;
          } else {
            energy = _energyMax;
          }
        } else if (energy < _energyMax) {
          energy = math.min(energy + _farmPerLevel[_level] * _speed * uint64(now - _lastCalcTime), _energyMax); 
        }
    }

//////////////////////////////////
    function startProcess(uint64 energyP, uint64 energyM) internal {
        _energy = calculateEnergy() + energyP - energyM;
        _lastCalcTime = now;
    }


////////////////////////////////// MARK CELL
    function markCell(
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
        }(_owner, _coord, targetCoord, _color, energy - _costPerLevel[0]);
    }
    
////////////////////////////////// HELP CELL
    function helpCell(
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
        }(_owner, _coord, _color, energy);
    }

    function _helpCell(
        address owner,
        Types.CubeCoord coord,
        Types.Color color,
        uint64 energy
    ) override external {
        require(msg.value > ACTION_VALUE, Errors.LOW_GAS_VALUE);
        require(owner == _owner, Errors.WRONG_OWNER);
        require(msg.sender == _resolveCell(coord), Errors.WRONG_ADDRESS);
        require(HexUtils.isCorrectCoord(coord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(_coord, coord) == true, Errors.WRONG_COORD);
        tvm.rawReserve(0, 4); 
        startProcess(energy, 0);
        _owner.transfer({value: 0, flag: MsgFlag.ALL_NOT_RESERVED + MsgFlag.IGNORE_ERRORS, bounce: false}); 
    }
    
    
////////////////////////////////// ATTK CELL
    function attkCell(
        Types.CubeCoord targetCoord,
        uint64 energy
    ) public onlyOwner {
        require(now < _endTime, Errors.TIME_IS_OVER);
        require(msg.value > ACTION_VALUE*4, Errors.LOW_GAS_VALUE);
        require(energy <= calculateEnergy(), Errors.NOT_ENOUGH_ENERGY);
        require(HexUtils.isCorrectCoord(targetCoord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(_coord, targetCoord) == true, Errors.WRONG_COORD);
        tvm.rawReserve(0, 4); 
        startProcess(0, energy);
        ICell(_resolveCell(targetCoord))._attkCell{
            value: 0 ton,
            flag: MsgFlag.ALL_NOT_RESERVED
        }(_owner, _coord, _color, energy);
    }

    function _attkCell(
        address owner,
        Types.CubeCoord coord,
        Types.Color color,
        uint64 energy
    ) override external {
        require(msg.value > ACTION_VALUE*3, Errors.LOW_GAS_VALUE);
        require(owner != _owner, Errors.WRONG_OWNER);
        require(msg.sender == _resolveCell(coord), Errors.WRONG_ADDRESS);
        require(HexUtils.isCorrectCoord(coord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(_coord, coord) == true, Errors.WRONG_COORD);
        tvm.rawReserve(0, 4); 
        uint64 energyTemp = calculateEnergy();
        if (energy <= energyTemp) {
          startProcess(0, energy);
        } else {
          IRouter(_router).onCellOwnerChanged{
              value: ACTION_VALUE*2,
              flag: 0
          }(_owner, owner);
          _owner = owner;
          _color = color;
          startProcess(energy - energyTemp, energyTemp);
        }
        owner.transfer({value: 0, flag: MsgFlag.ALL_NOT_RESERVED + MsgFlag.IGNORE_ERRORS, bounce: false}); 
    }

////////////////////////////////// ATTK CELL
    function upgradeCell(
    ) public onlyOwner {
        require(now < _endTime, Errors.TIME_IS_OVER);
        require(msg.value > ACTION_VALUE, Errors.LOW_GAS_VALUE);
        require(_level + 1 < _costPerLevel.length, Errors.WRONG_PARAMS);
        require(_costPerLevel[_level+1] <= calculateEnergy(), Errors.NOT_ENOUGH_ENERGY);
        tvm.rawReserve(0, 4); 
        startProcess(0, _costPerLevel[_level+1]);
        _level++;
        // console.log(format("upgradeCell {}", "OK"));
        _owner.transfer({value: 0, flag: MsgFlag.ALL_NOT_RESERVED + MsgFlag.IGNORE_ERRORS, bounce: false}); 
    }
////////////////////////////////////

    function _resolveCell(
        Types.CubeCoord coord
    ) public view returns (address cellAddress) {
        TvmCell code = _buildCellCode(_router);
        TvmCell state = _buildCellState(code, coord);
        uint256 hashState = tvm.hash(state);
        cellAddress = address.makeAddrStd(address(this).wid, hashState);
        // console.log(format("resolveCell 2 {}", cellAddress));
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
    
    function _destroy() public override onlyRouter {
        require(now > _endTime, Errors.TIME_IS_OVER);
        selfdestruct(_router);
    }


}