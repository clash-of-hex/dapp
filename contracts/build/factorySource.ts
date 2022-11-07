const cellAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"router","type":"address"},{"name":"owner","type":"address"},{"name":"endTime","type":"uint128"},{"name":"speed","type":"uint64"},{"components":[{"name":"r","type":"uint8"},{"name":"g","type":"uint8"},{"name":"b","type":"uint8"}],"name":"color","type":"tuple"},{"name":"energy","type":"uint64"}],"outputs":[]},{"name":"getRouter","inputs":[],"outputs":[{"name":"router","type":"address"}]},{"name":"getDetails","inputs":[],"outputs":[{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"coord","type":"tuple"},{"components":[{"name":"r","type":"uint8"},{"name":"g","type":"uint8"},{"name":"b","type":"uint8"}],"name":"color","type":"tuple"},{"name":"level","type":"uint64"},{"name":"speed","type":"uint64"},{"name":"endTime","type":"uint128"},{"name":"energy","type":"uint64"},{"name":"energySec","type":"uint64"},{"name":"energyMax","type":"uint64"},{"name":"lastCalcTime","type":"uint128"},{"name":"owner","type":"address"}]},{"name":"calculateEnergy","inputs":[],"outputs":[{"name":"energy","type":"uint64"}]},{"name":"markCell","inputs":[{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"targetCoord","type":"tuple"},{"name":"energy","type":"uint64"}],"outputs":[]},{"name":"helpCell","inputs":[{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"targetCoord","type":"tuple"},{"name":"energy","type":"uint64"}],"outputs":[]},{"name":"_helpCell","inputs":[{"name":"owner","type":"address"},{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"coord","type":"tuple"},{"components":[{"name":"r","type":"uint8"},{"name":"g","type":"uint8"},{"name":"b","type":"uint8"}],"name":"color","type":"tuple"},{"name":"energy","type":"uint64"}],"outputs":[]},{"name":"attkCell","inputs":[{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"targetCoord","type":"tuple"},{"name":"energy","type":"uint64"}],"outputs":[]},{"name":"_attkCell","inputs":[{"name":"owner","type":"address"},{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"coord","type":"tuple"},{"components":[{"name":"r","type":"uint8"},{"name":"g","type":"uint8"},{"name":"b","type":"uint8"}],"name":"color","type":"tuple"},{"name":"energy","type":"uint64"}],"outputs":[]},{"name":"upgradeCell","inputs":[],"outputs":[]},{"name":"_resolveCell","inputs":[{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"coord","type":"tuple"}],"outputs":[{"name":"cellAddress","type":"address"}]},{"name":"destruct","inputs":[{"name":"dest_addr","type":"address"}],"outputs":[]}],"data":[{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"key":1,"name":"_coord","type":"tuple"}],"events":[],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"_coord","type":"tuple"},{"name":"_costPerLevel","type":"uint64[]"},{"name":"_energyPerLevel","type":"uint64[]"},{"name":"_energyPerLevelMax","type":"uint64[]"},{"name":"_router","type":"address"},{"name":"_owner","type":"address"},{"name":"_speed","type":"uint64"},{"name":"_level","type":"uint64"},{"name":"_energy","type":"uint64"},{"name":"_lastCalcTime","type":"uint128"},{"name":"_endTime","type":"uint128"},{"components":[{"name":"r","type":"uint8"},{"name":"g","type":"uint8"},{"name":"b","type":"uint8"}],"name":"_color","type":"tuple"}]} as const
const gameRootAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"ownerPubkey","type":"uint256"},{"name":"codeRouter","type":"cell"},{"name":"codeCell","type":"cell"}],"outputs":[]},{"name":"getDetails","inputs":[],"outputs":[{"name":"nonce","type":"uint16"},{"name":"owner","type":"uint256"}]},{"name":"newRouter","inputs":[{"name":"roundTime","type":"uint64"},{"name":"radius","type":"uint64"},{"name":"speed","type":"uint64"},{"name":"name","type":"string"},{"name":"nonce","type":"uint16"}],"outputs":[]},{"name":"getOwner","inputs":[],"outputs":[{"name":"pubkey","type":"uint256"}]},{"name":"owner","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"pubkey","type":"uint256"}]},{"name":"transferOwnership","inputs":[{"name":"newOwner","type":"uint256"}],"outputs":[]}],"data":[{"key":1,"name":"_nonce","type":"uint16"}],"events":[{"name":"RouterCreated","inputs":[{"name":"nonce","type":"uint16"},{"name":"routerAddress","type":"address"}],"outputs":[]},{"name":"OwnershipTransferred","inputs":[{"name":"oldOwner","type":"uint256"},{"name":"newOwner","type":"uint256"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"_owner","type":"uint256"},{"name":"_nonce","type":"uint16"},{"name":"_codeRouter","type":"cell"},{"name":"_codeCell","type":"cell"}]} as const
const routerAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"codeCell","type":"cell"},{"name":"roundTime","type":"uint64"},{"name":"radius","type":"uint64"},{"name":"speed","type":"uint64"},{"name":"name","type":"string"}],"outputs":[]},{"name":"getDetails","inputs":[],"outputs":[{"name":"nonce","type":"uint32"},{"name":"endTime","type":"uint128"},{"name":"radius","type":"uint64"},{"name":"speed","type":"uint64"},{"name":"name","type":"string"},{"name":"root","type":"address"}]},{"name":"getUsers","inputs":[],"outputs":[{"name":"users","type":"map(address,uint128)"}]},{"name":"getAddressCells","inputs":[{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"coords","type":"tuple[]"}],"outputs":[{"name":"addreses","type":"address[]"}]},{"name":"newGame","inputs":[{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"baseCoord","type":"tuple"}],"outputs":[]},{"name":"_newCell","inputs":[{"name":"owner","type":"address"},{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"baseCoord","type":"tuple"},{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"targetCoord","type":"tuple"},{"components":[{"name":"r","type":"uint8"},{"name":"g","type":"uint8"},{"name":"b","type":"uint8"}],"name":"color","type":"tuple"},{"name":"energy","type":"uint64"}],"outputs":[]},{"name":"onCellOwnerChanged","inputs":[{"name":"oldOwner","type":"address"},{"name":"newOwner","type":"address"}],"outputs":[]},{"name":"_resolveCell","inputs":[{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"coord","type":"tuple"}],"outputs":[{"name":"cellAddress","type":"address"}]},{"name":"_users","inputs":[],"outputs":[{"name":"_users","type":"map(address,uint128)"}]}],"data":[{"key":1,"name":"_nonce","type":"uint32"}],"events":[{"name":"CellCreated","inputs":[{"name":"owner","type":"uint256"},{"components":[{"name":"x","type":"int64"},{"name":"y","type":"int64"},{"name":"z","type":"int64"}],"name":"coord","type":"tuple"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"_nonce","type":"uint32"},{"name":"_root","type":"address"},{"name":"_users","type":"map(address,uint128)"},{"name":"_codeCell","type":"cell"},{"name":"_radius","type":"uint64"},{"name":"_speed","type":"uint64"},{"name":"_name","type":"string"},{"name":"_endTime","type":"uint128"}]} as const
const sampleAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"_state","type":"uint256"}],"outputs":[]},{"name":"setState","inputs":[{"name":"_state","type":"uint256"}],"outputs":[]},{"name":"getDetails","inputs":[],"outputs":[{"name":"_state","type":"uint256"}]}],"data":[{"key":1,"name":"_nonce","type":"uint16"}],"events":[{"name":"StateChange","inputs":[{"name":"_state","type":"uint256"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"_nonce","type":"uint16"},{"name":"state","type":"uint256"}]} as const

export const factorySource = {
    Cell: cellAbi,
    GameRoot: gameRootAbi,
    Router: routerAbi,
    Sample: sampleAbi
} as const

export type FactorySource = typeof factorySource
export type CellAbi = typeof cellAbi
export type GameRootAbi = typeof gameRootAbi
export type RouterAbi = typeof routerAbi
export type SampleAbi = typeof sampleAbi
