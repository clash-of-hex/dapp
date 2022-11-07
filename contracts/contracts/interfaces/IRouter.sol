pragma ever-solidity >= 0.62.0;

import '../utils/Types.sol';

interface IRouter {

    event CellCreated(uint256 owner, Types.CubeCoord coord);
    
    function onCellOwnerChanged(
        address oldOwner,
        address newOwner
    ) external;
    
    function _newCell(
        address owner,
        Types.CubeCoord baseCoord,
        Types.CubeCoord targetCoord,
        Types.Color color,
        uint64 energy
    ) external; 
    
}