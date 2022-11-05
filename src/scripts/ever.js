import { Address, ProviderRpcClient, TvmException } from 'everscale-inpage-provider';
import { EverscaleStandaloneClient, SimpleKeystore, SimpleAccountsStorage, WalletV3Account } from 'everscale-standalone-client';
const { TonClient, signerKeys, signerNone } = require("@eversdk/core");
//const { libNode } = require("@eversdk/lib-node");
const { libWeb } = require("@eversdk/lib-web");
const { Account } = require("@eversdk/appkit");

TonClient.useBinaryLibrary(libWeb)

const routerAbi = require('../../contracts/build/Router.abi.json');
const cellAbi = require('../../contracts/build/Cell.abi.json');
const Config = require("../../config.json");  

let currentMap;

const ever = new ProviderRpcClient({
});

let everClient;
let subscribeAcc;

const createClient = (endpoint) => {
  let client = new TonClient({
      network: {
          endpoints: [endpoint],
          message_retries_count: 3,
          message_processing_timeout: 60000,
      },
  });
  return client
};

const getAccount = (abi, address = '', keys = null) => {
    try {
        return new Account({abi}, {
            address: address,
            signer: (keys ? signerKeys(keys) : signerNone()),
            client: everClient
        });
    } catch (error) {
        console.error(error);
    }
};

const getAccArr = async (addreses) => {
    try {
        const result = (await everClient.net.query_collection({
            collection: "accounts",
            filter: {
                id: {
                    in: addreses,
                },
            },
            result: "id acc_type balance boc",
        })).result;

        return result;
    } catch (error) {
        console.error(error);
    }
};

const runLocal = async (abi, address, functionName, input = {}, log = true, boc = null)  => {
  try {
    const [account, message] = await Promise.all([
        boc || everClient.net.query_collection({
            collection: "accounts",
            filter: { id: { eq: address } },
            result: "boc",
        })
            .then(({ result }) => result[0].boc)
            .catch(() => {
                return undefined;
            }),
        everClient.abi.encode_message({
            abi: {
                type: 'Contract',
                value: (abi)
            },
            address,
            call_set: {
                function_name: functionName,
                input: input,
            },
            signer: { type: "None" },
        }).then(({ message }) => message),
    ]);
    if (!account) return undefined;
    let response = await everClient.tvm.run_tvm({
        message: message,
        account: account,
        abi: {
            type: 'Contract',
            value: (abi)
        },
    });
    if (log) console.log("output:", response.decoded.output);

    return response.decoded.output;
  } catch (error) {
      console.error(error);
  }
}

function behavior(name, fn) {
    document.querySelectorAll(`[data-behavior=${name}]`).forEach(fn);
}

const innerText = (text) => (elem) => {
    elem.innerText = text;
}

function requestPermissions() {
    return ever.requestPermissions({
        permissions: [
            'basic',
            'accountInteraction',
        ],
    });
}

async function disconnectAction() {
    console.log('disconnectAction')
    await ever.disconnect();
}

async function getRoutersAction() {
    console.log('getRoutersAction')
    const providerState = await ever.getProviderState();
    let details = await ever.getAccountsByCodeHash({
      codeHash: Config[providerState.selectedConnection].codeHash,
      limit: 10
    });
    console.log('routers', details);
}

async function connect() {
    await ever.requestPermissions({
        permissions: [
            'basic',
            'accountInteraction',
        ],
    });
}

async function checkConnect() {
    const providerState = await ever.getProviderState();
    const permissions = providerState.permissions;
    const network = providerState.selectedConnection;
    if (!contractAddress(network) || !permissions.accountInteraction) {
        behavior('connect', elem => elem.onclick = requestPermissions);
        switchScreen("login");
        const connectText = elem => {
            const disabled = !contractAddress(network);
            elem.disabled = disabled;
            elem.innerText = disabled ? `Contract not found` : `Connect with ${network}`;
        };
        behavior('connect', connectText);
    } else {
        // INFO for transactionsFound and contractStateChanged need permissions
        const providerState = await ever.getProviderState();
        (await ever.subscribe('transactionsFound', {
            address: contractAddress(providerState.selectedConnection),
        })).on('data', (event) => {
            console.log(':', {
                address: event.address,
                transactions: event.transactions,
                info: event.info,
            });
        });
        (await ever.subscribe('contractStateChanged', {
            address: contractAddress(providerState.selectedConnection),
        })).on('data', (event) => {
            console.log('permissionsChanged:', {
                address: event.address,
                state: event.state,
            });
        });
        switchScreen("main");
        const account = permissions.accountInteraction;
        let address = account.address.toString();
        let pubkey = account.address.toString();
        behavior('address', innerText(`${address.substr(0,6)}...${address.substr(-4,4)}`));
        behavior('publicKey', innerText(`${pubkey.substr(0,6)}...${pubkey.substr(-4,4)}`));
        behavior('disconnectAction', elem => elem.onclick = disconnectAction);
        behavior('getRoutersAction', elem => elem.onclick = getRoutersAction);
        
        console.log('endpoint:', Config[network].endpoint);
        everClient = createClient(Config[network].endpoint);
        subscribeAcc = getAccount({});

        loadMap();
    }
}

async function setNetworkChanged(network) {
    const mod = network === 'mainnet' ? 'success' : 'secondary';
    const out = `<span class="badge bg-${mod}">${network}</span>`;
    behavior('network',elem => elem.innerHTML = out);
    await checkConnect();
}

function contractAddress(network, name = "router") {
    if (Config[network] && Config[network][name]) {
        return new Address(Config[network][name]);
    }
    return null
}

function switchScreen(to) {
    console.log('switchScreen:', to);
    [
        "extension",
        "login",
        "main",
    ].forEach(screen => {
        const switcher = elem => elem.style.display = (to === screen ? 'table-row' : 'none');
        behavior(screen, switcher);
    });
}

async function mainFlow() {
    const providerState = await ever.getProviderState();
    console.log('selectedConnection:', providerState.selectedConnection);
    await setNetworkChanged(providerState.selectedConnection);
    (await ever.subscribe('networkChanged')).on('data', event => {
        console.log('networkChanged:', event.selectedConnection);
        setNetworkChanged(event.selectedConnection);
    });
    (await ever.subscribe('permissionsChanged')).on('data', async (event) => {
        console.log('permissionsChanged:', event.permissions);
        await checkConnect();
    });
}

async function loadMap() {
    await routerDetails();
    let coords = []
    for (const hex of currentMap) {
        coords.push({x: hex.q, y: hex.r, z: hex.s})
    }

    let addreses = await getAddressCells(coords);
    addreses = addreses.map(el => el.toString())
    let i=0;
    for (const hex of currentMap) {
        hex.address = addreses[i];
        i++;
    }
    
    await subscribeAllCellState(addreses);
    let accs = await getAccArr(addreses);
    console.log('accs', accs);
    for (let i = 0; i < accs.length; i++) {
        let details = await getDetailsCell(accs[i].id, accs[i].boc);
        if (details) {
          let hex = findHex(accs[i].id);
          console.log('hex', hex);
          if (hex) {
            hex.details = details;
          }        
        }
    }

}

export async function init(map) {
    currentMap = map;
    if ((await ever.hasProvider())) {
        try {
            await ever.ensureInitialized();
            await mainFlow();
        } catch (error) {
            throw error; // TODO handle it
        }
    } else {
        switchScreen("extension");
    }
}

function findHex(address) {
  let _hex;
  for (const hex of currentMap) {
    if (hex.address == address) {
      _hex = hex;
      break;
    }
  }
  return _hex;
}


export async function routerDetails() {

  const providerState = await ever.getProviderState();
  const router = new ever.Contract(routerAbi, contractAddress(providerState.selectedConnection, 'router'));
  try {
    let details
    details = await router.methods.getDetails({}).call();
    console.log('getDetails router', details);
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }

}

export async function subscribeAllCellState(arrAcc) {

  try {
    
    await subscribeAcc.free();  
    await subscribeAcc.subscribe("accounts", {
      id: { in: arrAcc } 
    }, "id boc", 
    async (msg) => {
      console.log(`onAcc:`, msg.id);
      let hex = findHex(msg.id);
      console.log('hex', hex);
      if (hex) {
        hex.details = await getDetailsCell(msg.id, msg.boc);
      }        
    }, 
    async (msg) => {
      console.log(`onError:`, msg);
    });
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }
    
}

export async function getAddressCells(coords) {

  const providerState = await ever.getProviderState();
  const router = new ever.Contract(routerAbi, contractAddress(providerState.selectedConnection, 'router'));

  try {
    let details
    details = await router.methods.getAddressCells({ coords }).call();
    console.log('getAddressCells router', details);
    return details.addreses
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }

}

export async function newGame(cellCoord) {

  const providerState = await ever.getProviderState();
  const permissions = providerState.permissions;
  if (!permissions.accountInteraction) return;
  const account = permissions.accountInteraction;

  const router = new ever.Contract(routerAbi, contractAddress(providerState.selectedConnection, 'router'));

  try {
    console.log('newGame', 1);
    let res = await router.methods.newGame({
        sendGasTo: account.address.toString(),
        baseCoord: cellCoord
    }).send({
        from: account.address.toString(),
        amount: '2000000000',
    });
    console.log('newGame', res);

  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }

}

export async function markCell(address, cellCoord, energy) {

  const providerState = await ever.getProviderState();
  const permissions = providerState.permissions;
  if (!permissions.accountInteraction) return;
  const account = permissions.accountInteraction;

  const cell = new ever.Contract(cellAbi, address);

  try {
    console.log('markCell', 1);
    let res = await cell.methods.markCell({
        sendGasTo: account.address.toString(),
        targetCoord: cellCoord,
        energy: energy
    }).send({
        from: account.address.toString(),
        amount: '2000000000',
    });
    console.log('markCell', res);

  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }

}

export async function upgradeCell(address) {

  const providerState = await ever.getProviderState();
  const permissions = providerState.permissions;
  if (!permissions.accountInteraction) return;
  const account = permissions.accountInteraction;

  const cell = new ever.Contract(cellAbi, address);

  try {
    console.log('upgradeCell', 1);
    let res = await cell.methods.upgradeCell({
        sendGasTo: account.address.toString(),
    }).send({
        from: account.address.toString(),
        amount: '1000000000',
    });
    console.log('upgradeCell', res);

  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }

}

export async function helpCell(address, cellCoord, energy) {

  const providerState = await ever.getProviderState();
  const permissions = providerState.permissions;
  if (!permissions.accountInteraction) return;
  const account = permissions.accountInteraction;

  const cell = new ever.Contract(cellAbi, address);

  try {
    console.log('helpCell', 1);
    let res = await cell.methods.helpCell({
        sendGasTo: account.address.toString(),
        targetCoord: cellCoord,
        energy: energy
    }).send({
        from: account.address.toString(),
        amount: '1000000000',
    });
    console.log('helpCell', res);

  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }

}

export async function attkCell(address, cellCoord, energy) {

  const providerState = await ever.getProviderState();
  const permissions = providerState.permissions;
  if (!permissions.accountInteraction) return;
  const account = permissions.accountInteraction;

  const cell = new ever.Contract(cellAbi, address);

  try {
    console.log('attkCell', 1);
    let res = await cell.methods.attkCell({
        sendGasTo: account.address.toString(),
        targetCoord: cellCoord,
        energy: energy
    }).send({
        from: account.address.toString(),
        amount: '1000000000',
    });
    console.log('attkCell', res);

  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }

}

export async function getDetailsCell(address, boc = null) {

  if (boc) {
    try {
        const output = await runLocal(cellAbi, address, "getDetails", {}, true, boc);
        return output;
    } catch (error) {
        console.error(error);
    }
  }
  const cell = new ever.Contract(cellAbi, address);
  try {
    const stateRes = await cell.getFullState();
    if (stateRes.state == null || !stateRes.state.isDeployed) {
        return null;
    } 
    //console.log('state', stateRes.state);
    let details
    details = await cell.methods.getDetails({}).call();
    console.log('getDetails cell', details);
    return details
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }

}

export async function subscribePermissionsChanged() {
  await ever.subscribe('permissionsChanged').on('data', permissions => {
    console.log(permissions)
  })
}


