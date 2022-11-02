pragma ever-solidity >= 0.62.0;

import './Types.sol';

library HexUtils {

    function cube_scale(Types.CubeCoord cube, int64 radius) internal returns(Types.CubeCoord) {
        return Types.CubeCoord( cube.x*radius, cube.y*radius, cube.z*radius );
    }

    function cube_add(Types.CubeCoord a, Types.CubeCoord b) internal returns(Types.CubeCoord) {
        return Types.CubeCoord( a.x+b.x, a.y+b.y, a.z+b.z );
    }

    function cube_directions() internal returns(Types.CubeCoord[]) {
        Types.CubeCoord[6] CubeDirections = [
            Types.CubeCoord(  1, -1,  0 ),
            Types.CubeCoord(  1,  0, -1 ),
            Types.CubeCoord(  0,  1, -1 ),
            Types.CubeCoord( -1,  1,  0 ),
            Types.CubeCoord( -1,  0,  1 ),
            Types.CubeCoord(  0, -1,  1 )
        ];
        return CubeDirections;
    }

    function cube_to_axial(Types.CubeCoord cube) internal returns(Types.HexCoord) {
        return Types.HexCoord( cube.x, cube.z );
    }

    function axial_to_cube(Types.HexCoord a) internal returns(Types.CubeCoord) {
        return Types.CubeCoord( a.q, a.r, -a.q-a.r );
    }

    function cube_distance(Types.CubeCoord a, Types.CubeCoord b) internal returns(int64) {
        return math.max(math.abs(a.x - b.x), math.abs(a.y - b.y), math.abs(a.z - b.z));
    }

    function hex_distance(Types.HexCoord a, Types.HexCoord b) internal returns(int64) {
        return cube_distance(axial_to_cube(a), axial_to_cube(b));
    }

    function isCorrectCoord(Types.CubeCoord cube) internal returns(bool) {
        return cube.x + cube.y + cube.z == 0;
    }

    function isNeighborCoord(Types.CubeCoord a, Types.CubeCoord b) internal returns(bool) {
        return cube_distance(a, b) == 1;
    }

    function cube_cells(Types.CubeCoord center, int64 radius) internal returns(Types.CubeCoord[]) {
      Types.CubeCoord[] coords;
      for (int64 x = -radius; x <= radius; x++) {
        for (int64 y = math.max(-radius, -x-radius); y <= math.min(radius, -x+radius); y++) {
          coords.push(cube_add(center, Types.CubeCoord( x, y, -x-y )));
        }
      }	
      return coords;
    }

    function cube_ring(Types.CubeCoord center, int64 radius) internal returns(Types.CubeCoord[]) {
      Types.CubeCoord[6] CubeDirections = cube_directions();
      Types.CubeCoord[] coords;
      Types.CubeCoord cube = cube_add(center, cube_scale(CubeDirections[4], radius));
      for (uint256 i = 0; i < 6; i++) {
        for (int64 j = 0; j < radius; j++) {
          coords.push(cube);
          cube = cube_add(cube, CubeDirections[i]);
        }
      }	
      return coords;
    }

    function cube_neighbors(Types.CubeCoord center) internal returns(Types.CubeCoord[]) {
      Types.CubeCoord[6] CubeDirections = cube_directions();
      Types.CubeCoord[] coords;
      for (uint256 i = 0; i < 6; i++) {
        coords.push(cube_add(center, CubeDirections[i]));
      }	
      return coords;
    }

    function countOnRadius(int64 radius) internal returns(int64) {
      int64 count = 1;
      for (int64 i = 1; i <= radius; i++) {
        count += i * 6;
      }	
      return count;
    }

}