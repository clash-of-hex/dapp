pragma ever-solidity >= 0.62.0;

library Errors {

    uint16 constant NOT_OWNER                                       = 1000;
    uint16 constant WRONG_OWNER                                     = 1010;
    uint16 constant WRONG_ADDRESS                                   = 1020;
    uint16 constant WRONG_AMOUNT                                    = 1050;
    uint16 constant NOT_ENOUGH_BALANCE                              = 1060;
    uint16 constant NON_EMPTY_BALANCE                               = 1070;

    uint16 constant LOW_GAS_VALUE                                   = 2000;
    
    uint16 constant WRONG_COORD                                     = 3000;
    uint16 constant NOT_ENOUGH_ENERGY                               = 3010;
    uint16 constant WRONG_PARAMS                                    = 3020;
    uint16 constant TIME_IS_OVER                                    = 3030;
    
}
