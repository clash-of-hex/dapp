import { Address, ProviderRpcClient, TvmException } from 'everscale-inpage-provider';
import { EverscaleStandaloneClient, SimpleKeystore, SimpleAccountsStorage, WalletV3Account } from 'everscale-standalone-client';

const routerAbi = require('../../contracts/build/Router.abi.json');
const cellAbi = require('../../contracts/build/Cell.abi.json');
const Config = require("../../config.json");  

let currentMap;

const ever = new ProviderRpcClient({
});

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
    // if (addr[network] && addr[network][name]) {
        // return new Address(addr[network][name]);
    // }
    // return null
    return new Address(Config.router)
}

// async function Contract() {
    // const providerState = await ever.getProviderState();
    // const address = contractAddress(providerState.selectedConnection);
    // return new ever.Contract(abi, address);
// }

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
    for (let i = 0; i < currentMap.length; i++) {
        let hex = currentMap[i]
        coords.push({x: hex.x, y: hex.y, z: -hex.x-hex.y})
    }
    let addreses = await getAddressCells(coords);
    for (let i = 0; i < currentMap.length; i++) {
        let hex = currentMap[i]
        hex.address = addreses[i];
        await subscribeCellState(addreses[i], hex);
        hex.details = await getDetailsCell(addreses[i]);
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

export async function subscribeCellState(address, hex) {

  try {
    (await ever.subscribe('contractStateChanged', {
        address: address,
    })).on('data', async (event) => {
        // console.log('contractStateChanged:', {
            // address: event.address,
            // state: event.state,
        // });
        hex.details = await getDetailsCell(event.address);
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

export async function getDetailsCell(address) {

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


