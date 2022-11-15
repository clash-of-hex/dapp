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

contract Router is IRouter {

    uint32 static _nonce;
    
    // constants
    uint128 constant ROUTER_DEPLOY_VALUE = 1.0 ever;
    uint128 constant CELL_DEPLOY_VALUE = 1.0 ever;
    uint128 constant ACTION_VALUE = 0.2 ever;
    uint128 constant JOIN_GAME_FEE = 10.0 ever;

    address private _root; 
    
    modifier onlyRoot() virtual {
        require(_root == msg.sender, 100);
        require(msg.value != 0, 101);
        _;
    }    

    mapping(address => uint128) public _users; 
    mapping(address => uint128) public _rewards; 
    
    TvmCell private _codeCell;
    uint64 private _roundTime;
    uint64 private _radius;
    uint64 private _speed;
    uint64 private _userCount;
    string private _name;
    uint128 private _endTime;

    constructor(
        TvmCell codeCell,
        uint64 roundTime,
        uint64 radius,
        uint64 speed,
        uint64 userCount,
        string name
    ) public {
        require(address(this).balance > ROUTER_DEPLOY_VALUE, Errors.NOT_ENOUGH_BALANCE);
        tvm.accept();
        _root = msg.sender;
        _codeCell = codeCell;
        _roundTime = roundTime;
        _radius = radius;
        _speed = speed;
        _userCount = userCount;
        _name = name;
        if (_userCount == 0) {
          _endTime = now + _roundTime;
        }
        // console.log(format("router constructor msg.sender {}", msg.sender));
    }

    function getDetails() public view returns(
        uint32 nonce, uint128 endTime, uint64 roundTime, uint64 radius, uint64 speed, uint64 userCount, string name, address root
    ) {
        return ( _nonce, _endTime, _roundTime, _radius, _speed, _userCount, _name, _root );
    }

    function getUsers() public view returns(
        mapping(address => uint128) users
    ) {
        return ( _users );
    }

    function getRewards() public view returns(
        mapping(address => uint128) rewards
    ) {
        return ( _rewards );
    }

    function winCount() public view returns(
        uint128 count
    ) {
        for ((address userAddress, uint128 userCount) : _users) {
            if(userCount > count) {
                count = userCount; 
            } 
        }
    }

    function getAddressCells(
        Types.CubeCoord[] coords
    ) public view returns(
        address[] addreses
    ) {
        for (uint256 i = 0; i < coords.length; i++) {
          addreses.push(_resolveCell(coords[i]));
        }	
        return addreses;
    }
    ////////////////////////////// 
    
    function newGame(
        Types.CubeCoord baseCoord
    ) public {
        require(msg.value > JOIN_GAME_FEE + CELL_DEPLOY_VALUE + ACTION_VALUE*2, Errors.LOW_GAS_VALUE);
        require(now < _endTime, Errors.TIME_IS_OVER);
        require(_users.exists(msg.sender) == false, Errors.WRONG_OWNER);
        require(HexUtils.isCorrectCoord(baseCoord) == true, Errors.WRONG_COORD);
        tvm.rawReserve(JOIN_GAME_FEE, 4); 
        _users[msg.sender] = 1;
        if (_userCount != 0 && _users.keys().length ==  uint128(_userCount)) {
          _endTime = now + _roundTime;
        }
        // console.log(format("newGame msg.sender {}", msg.sender));
        address cellAddress = deployCell(msg.sender, baseCoord, Types.Color(getRndUint8(), getRndUint8(), getRndUint8()), 5000);
    }

    function _newCell(
        address owner, 
        Types.CubeCoord baseCoord,
        Types.CubeCoord targetCoord,
        Types.Color color,
        uint64 energy
    ) override external {
        require(now < _endTime, Errors.TIME_IS_OVER);
        require(msg.value > CELL_DEPLOY_VALUE + ACTION_VALUE*2, Errors.LOW_GAS_VALUE);
        require(_users.exists(owner) == true, Errors.WRONG_OWNER);
        require(HexUtils.isCorrectCoord(baseCoord) == true, Errors.WRONG_COORD);
        require(HexUtils.isCorrectCoord(targetCoord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(baseCoord, targetCoord) == true, Errors.WRONG_COORD);
        require(msg.sender == _resolveCell(baseCoord), Errors.WRONG_ADDRESS);
        tvm.rawReserve(0, 4); 
        _users[owner] += 1;
        address cellAddress = deployCell(owner, targetCoord, color, energy);
    }

    function onCellOwnerChanged(
        address oldOwner,
        address newOwner
    ) override external {
        require(now < _endTime, Errors.TIME_IS_OVER);
        require(msg.value > ACTION_VALUE, Errors.LOW_GAS_VALUE);
        //require(msg.sender == _resolveCell(baseCoord), Errors.WRONG_ADDRESS); Придумать Проверку откуда пришло сообщение
        require(_users.exists(oldOwner) == true, Errors.WRONG_OWNER);
        require(_users.exists(newOwner) == true, Errors.WRONG_OWNER);
        tvm.rawReserve(0, 4); 
        _users[oldOwner] -= 1;
        _users[newOwner] += 1;
        newOwner.transfer({value: 0, flag: MsgFlag.ALL_NOT_RESERVED + MsgFlag.IGNORE_ERRORS, bounce: false}); 
    }

    function destroyCells(
        address[] cells
    ) public {
        require(cells.length <= 10, Errors.WRONG_PARAMS);
        require(msg.value > ACTION_VALUE*cells.length, Errors.LOW_GAS_VALUE);
        require(now > _endTime, Errors.TIME_IS_OVER);
        //require(_users.exists(msg.sender) == false, Errors.WRONG_OWNER);
        for (address _address : cells) {
            ICell(_address)._destroy{
                value: ACTION_VALUE
            }();
        }	
        msg.sender.transfer({value: 0, flag: MsgFlag.REMAINING_GAS + MsgFlag.IGNORE_ERRORS, bounce: false});
    }

    function calcRewards(
    ) public {
        require(msg.value > ACTION_VALUE*5, Errors.LOW_GAS_VALUE);
        require(now > _endTime, Errors.TIME_IS_OVER);
        require(_rewards.empty(), Errors.TIME_IS_OVER);
        // tvm.rawReserve(0, 4); 
        uint128 _winCount = winCount();
        uint128 _winnersCount = 0;
        for ((address userAddress, uint128 userCount) : _users) {
            if(userCount == _winCount) {
                _winnersCount++; 
            } 
        }
        uint128 rewardAll = address(this).balance - msg.value - ROUTER_DEPLOY_VALUE;
        uint128 rewardRoot = rewardAll / 20;
        uint128 reward = (rewardAll - rewardRoot) / _winnersCount;
        for ((address userAddress, uint128 userCount) : _users) {
            if(userCount == _winCount) {
                _rewards[userAddress] = reward; 
            } 
        }	
        _root.transfer({value: rewardRoot, flag: MsgFlag.IGNORE_ERRORS, bounce: false});
        msg.sender.transfer({value: 0, flag: MsgFlag.REMAINING_GAS + MsgFlag.IGNORE_ERRORS, bounce: false});
    }

    function claimReward(
    ) public {
        require (msg.value > ACTION_VALUE);
        require(_rewards.exists(msg.sender), Errors.WRONG_OWNER);
        require(_rewards[msg.sender] > 0, Errors.WRONG_AMOUNT);
        uint128 reward = _rewards[msg.sender];
        //tvm.rawReserve(reward, 12);//8 + 4 -> reserve = original_balance - value
        _rewards[msg.sender] = 0;
        msg.sender.transfer({value: reward, flag: MsgFlag.REMAINING_GAS + MsgFlag.IGNORE_ERRORS, bounce: false});
    }
     ////////////////////////////// 
    
    function deployCell(address owner, Types.CubeCoord coord, Types.Color color, uint64 energy) internal returns (address cellAddress) {

        TvmCell code = _buildCellCode(address(this));
        TvmCell state = _buildCellState(code, coord);
        cellAddress = new Cell{
            stateInit: state,
            value: CELL_DEPLOY_VALUE + ACTION_VALUE,
            flag: 0
        }(
            address(this),
            owner,
            _endTime,
            _speed,
            color,
            energy
        ); 
        // emit CellCreated(owner, coord, cellAddress);
        owner.transfer({value: 0, flag: MsgFlag.ALL_NOT_RESERVED + MsgFlag.IGNORE_ERRORS, bounce: false}); 

    }

    function _resolveCell(
        Types.CubeCoord coord
    ) public view returns (address cellAddress) {
        TvmCell code = _buildCellCode(address(this));
        TvmCell state = _buildCellState(code, coord);
        uint256 hashState = tvm.hash(state);
        cellAddress = address.makeAddrStd(address(this).wid, hashState);
    }

    function _buildCellCode(address router) internal view returns (TvmCell) {
        TvmBuilder salt;
        salt.store(router);
        return tvm.setCodeSalt(_codeCell, salt.toCell());
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

    onBounce(TvmSlice slice) external {
        uint32 functionId = slice.decode(uint32);
        if (functionId == tvm.functionId(Cell)) {
          // console.log(format("onBounce Cell constructor {} {}", msg.sender, functionId));
        }
    }

    function getRndUint8() internal returns(uint8) {
        rnd.shuffle();
        uint8 r = rnd.next(uint8(255));
        return r;
    }

}
