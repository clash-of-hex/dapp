pragma ever-solidity >= 0.62.0;

import '../utils/Types.sol';

interface ICell {

    function _helpCell(
        address sendGasTo,
        Types.CubeCoord coord,
        Types.Color color,
        uint128 energy
    ) external; 

    function _attkCell(
        address sendGasTo,
        Types.CubeCoord coord,
        Types.Color color,
        uint128 energy
    ) external; 

}