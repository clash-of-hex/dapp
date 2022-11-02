pragma ever-solidity >= 0.62.0;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "locklift/src/console.sol";

import './abstract/OwnableExternal.sol';
import './libraries/MsgFlag.sol';
import './libraries/Errors.sol';
import './utils/HexUtils.sol';
import './utils/Types.sol';

import './additional/Cell.sol';
import './interfaces/IRouter.sol';
import './interfaces/ICell.sol';

contract Router is OwnableExternal, IRouter {

    uint16 static _nonce;
    
    // constants
    uint128 constant ROUTER_DEPLOY_VALUE = 1.0 ever;
    uint128 constant CELL_DEPLOY_VALUE = 1.0 ever;

    TvmCell private _codeCell;

    constructor(
        uint256 ownerPubkey,
        TvmCell codeCell
    ) OwnableExternal (
        ownerPubkey
    ) public {
        require(address(this).balance > ROUTER_DEPLOY_VALUE, Errors.NOT_ENOUGH_BALANCE);
        tvm.accept();
        _codeCell = codeCell;
    }

    function getDetails() public view returns(
        uint16 nonce, uint256 owner
    ) {
        return ( _nonce, OwnableExternal.owner() );
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
        require(msg.value > CELL_DEPLOY_VALUE, Errors.LOW_GAS_VALUE);
        require(HexUtils.isCorrectCoord(baseCoord) == true, Errors.WRONG_COORD);
        tvm.accept();

        address cellAddress = deployCell(msg.pubkey(), baseCoord, Types.Color(getRndUint8(), getRndUint8(), getRndUint8()), 0);
        console.log(format("newGame {}", cellAddress));
    }

    function _newCell(
        Types.CubeCoord baseCoord,
        Types.CubeCoord targetCoord,
        Types.Color color,
        uint128 energy
    ) override external {
        require(msg.value > CELL_DEPLOY_VALUE, Errors.LOW_GAS_VALUE);
        require(msg.sender == _resolveCell(baseCoord), Errors.WRONG_ADDRESS);
        require(HexUtils.isCorrectCoord(baseCoord) == true, Errors.WRONG_COORD);
        require(HexUtils.isCorrectCoord(targetCoord) == true, Errors.WRONG_COORD);
        require(HexUtils.isNeighborCoord(baseCoord, targetCoord) == true, Errors.WRONG_COORD);
        tvm.accept();
        
        address cellAddress = deployCell(msg.pubkey(), targetCoord, color, energy);
        console.log(format("_newCell {}", cellAddress));
    }


    ////////////////////////////// 
    
    function deployCell(uint256 owner, Types.CubeCoord coord, Types.Color color, uint128 energy) internal returns (address cellAddress) {

        TvmCell code = _buildCellCode(address(this));
        TvmCell state = _buildCellState(code, coord);
        cellAddress = new Cell{
            stateInit: state,
            value: 0,
            flag: 64
        }(
            address(this),
            owner, 
            color,
            energy
        ); 
        // emit CellCreated(owner, coord, cellAddress);

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
          console.log(format("onBounce Cell constructor {} {}", msg.sender, functionId));
        }
    }

    function getRndUint8() internal returns(uint8) {
        rnd.shuffle();
        uint8 r = rnd.next(uint8(255));
        return r;
    }

}
