pragma ever-solidity >= 0.62.0;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "locklift/src/console.sol";

import './abstract/OwnableExternal.sol';
import './libraries/MsgFlag.sol';
import './libraries/Errors.sol';

import './additional/Router.sol';

contract GameRoot is OwnableExternal {

    uint16 static _nonce;
    
    // constants
    uint128 constant ROOT_DEPLOY_VALUE = 1.0 ever;
    uint128 constant ROUTER_DEPLOY_VALUE = 1.0 ever;
    uint128 constant ACTION_VALUE = 0.2 ever;

    TvmCell private _codeRouter;
    TvmCell private _codeCell;
    
    event RouterCreated(uint16 nonce, address routerAddress); 

    constructor(
        uint256 ownerPubkey,
        TvmCell codeRouter,
        TvmCell codeCell
    ) OwnableExternal (
        ownerPubkey
    ) public {
        require(address(this).balance > ROOT_DEPLOY_VALUE, Errors.NOT_ENOUGH_BALANCE);
        tvm.accept();
        _codeRouter = codeRouter;
        _codeCell = codeCell;
        console.log(format("constructor msg.sender {}", msg.sender));
    }

    function getDetails() public view returns(
        uint16 nonce, uint256 owner
    ) {
        return ( _nonce, OwnableExternal.owner() );
    }

    ////////////////////////////// 
    
    function newRouter(
        address sendGasTo,
        uint64 roundTime,
        uint64 radius,
        uint64 speed,
        string name,
        uint16 nonce
    ) public {
        require(msg.value > ROUTER_DEPLOY_VALUE + ACTION_VALUE*2, Errors.LOW_GAS_VALUE);
        require(radius <= 10, Errors.WRONG_PARAMS);
        require(speed <= 10, Errors.WRONG_PARAMS);
        require(name.byteLength() < 128, Errors.WRONG_PARAMS);
        tvm.rawReserve(0, 4); 

        address routerAddress = deployRouter(sendGasTo, roundTime, radius, speed, name);
        emit RouterCreated(nonce, routerAddress);
    }

    ////////////////////////////// 
    
    function deployRouter(address sendGasTo, uint64 roundTime, uint64 radius, uint64 speed, string name) internal returns (address routerAddress) {

        TvmCell code = _buildRouterCode(address(this));
        TvmCell state = _buildRouterState(code);
        routerAddress = new Router{
            stateInit: state,
            value: ROUTER_DEPLOY_VALUE + ACTION_VALUE,
            flag: 0
        }(
            address(this),
            _codeCell,
            roundTime,
            radius,
            speed,
            name
        ); 
        sendGasTo.transfer({value: 0, flag: MsgFlag.ALL_NOT_RESERVED + MsgFlag.IGNORE_ERRORS, bounce: false}); 

    }

    function _buildRouterCode(address root) internal view returns (TvmCell) {
        TvmBuilder salt;
        salt.store(root);
        return tvm.setCodeSalt(_codeRouter, salt.toCell());
    }

    function _buildRouterState(
        TvmCell code
    ) internal pure returns (TvmCell) {
        return tvm.buildStateInit({
            contr: Router,
            varInit: { _nonce: getRndUint32() },
            code: code
        });
    }

    onBounce(TvmSlice slice) external {
        uint32 functionId = slice.decode(uint32);
        if (functionId == tvm.functionId(Router)) {
          console.log(format("onBounce Router constructor {} {}", msg.sender, functionId));
        }
    }

    function getRndUint32() internal pure returns(uint32) {
        rnd.shuffle();
        uint32 r = rnd.next(uint32(4294967295));
        return r;
    }

}
