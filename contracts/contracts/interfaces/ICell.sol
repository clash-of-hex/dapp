pragma ever-solidity >= 0.62.0;

import '../utils/Types.sol';

interface ICell {

    function _helpCell(
        Types.CubeCoord coord,
        Types.Color color,
        uint128 energy
    ) external; 

    function _attkCell(
        Types.CubeCoord coord,
        Types.Color color,
        uint128 energy
    ) external; 

}