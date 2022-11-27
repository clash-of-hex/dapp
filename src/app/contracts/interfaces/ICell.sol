pragma ever-solidity >= 0.62.0;

import '../utils/Types.sol';

interface ICell {

    function _helpCell(
        address owner,
        Types.CubeCoord coord,
        Types.Color color,
        uint64 energy
    ) external; 

    function _attkCell(
        address owner,
        Types.CubeCoord coord,
        Types.Color color,
        uint64 energy
    ) external; 

    function _destroy() external; 

}