import { Address, ProviderRpcClient, TvmException } from 'everscale-inpage-provider';
import { EverscaleStandaloneClient, SimpleKeystore, SimpleAccountsStorage, WalletV3Account } from 'everscale-standalone-client';

const routerAbi = require('../../../prog1/build/Router.abi.json');
const cellAbi = require('../../../prog1/build/Cell.abi.json');
// console.log('routerAbi', routerAbi)
const phrase = "action inject penalty envelope rabbit element slim tornado dinner pizza off blood";
const keyPair = {
  secretKey: 'bb2903d025a330681e78f3bcb248d7d89b861f3e8a480eb74438ec0299319f7a',
  publicKey: 'e85f61aaef0ea43afc14e08e6bd46c3b996974c495a881baccc58760f6349300'
}
const accountAddress = new Address('0:08beb8d49e0312a5ef466d81cc37fe94e8f4e575fce884236f1227235c38f933');
const routerAddress =  new Address('0:0c87060ebe60a9711c91cb8052498eeb356be70c57892090fcbb90d969801473');

let keystore = new SimpleKeystore()
keystore.addKeyPair(keyPair);

let accountsStorage = new SimpleAccountsStorage()
accountsStorage.addAccount(new WalletV3Account(accountAddress))

const ever = new ProviderRpcClient({
  // You can pass `false` to still use extension if it is installed
  forceUseFallback: true,
  
  fallback: async () => EverscaleStandaloneClient.create({
    connection: {
        group: "localnet",
        type: "graphql",
        data: {
          endpoints: ["http://localhost/graphql"],
          local: true,
        },
    },
    keystore,
    accountsStorage,
  })
});

export async function init() {
  await ever.ensureInitialized();
  
  // await ever.requestPermissions({
    // permissions: ['basic'],
  // });
  
  await routerDetails();
  console.log('ever', ever);
}


export async function routerDetails() {

  const router = new ever.Contract(routerAbi, routerAddress);

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

  const router = new ever.Contract(routerAbi, routerAddress);

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

  const router = new ever.Contract(routerAbi, routerAddress);

  try {
    console.log('newGame', 1);
    let res = await router.methods.newGame({
        baseCoord: cellCoord
    }).send({
        from: accountAddress,
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

  const cell = new ever.Contract(cellAbi, address);

  try {
    console.log('markCell', 1);
    let res = await cell.methods.markCell({
        targetCoord: cellCoord,
        energy: energy
    }).send({
        from: accountAddress,
        amount: '3000000000',
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

  const cell = new ever.Contract(cellAbi, address);

  try {
    console.log('upgradeCell', 1);
    let res = await cell.methods.upgradeCell({
    }).send({
        from: accountAddress,
        amount: '3000000000',
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

  const cell = new ever.Contract(cellAbi, address);

  try {
    console.log('helpCell', 1);
    let res = await cell.methods.helpCell({
        targetCoord: cellCoord,
        energy: energy
    }).send({
        from: accountAddress,
        amount: '3000000000',
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

  const cell = new ever.Contract(cellAbi, address);

  try {
    console.log('attkCell', 1);
    let res = await cell.methods.attkCell({
        targetCoord: cellCoord,
        energy: energy
    }).send({
        from: accountAddress,
        amount: '3000000000',
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


