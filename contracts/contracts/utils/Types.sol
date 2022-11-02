pragma ever-solidity >= 0.62.0;



library Types {

    struct CubeCoord {
        int64 x;
        int64 y;
        int64 z;
    }

    struct HexCoord {
        int64 q;
        int64 r;
    }

    struct Color {
        uint8 r;
        uint8 g;
        uint8 b;
    }
}