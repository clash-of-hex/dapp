pragma ever-solidity >= 0.62.0;

import '../utils/Types.sol';

interface IRouter {

    event CellCreated(uint256 owner, Types.CubeCoord coord);
    
    function _newCell(
        Types.CubeCoord baseCoord,
        Types.CubeCoord targetCoord,
        Types.Color color,
        uint128 energy
    ) external; 
    
}