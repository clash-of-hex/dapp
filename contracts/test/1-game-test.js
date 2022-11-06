import { WalletTypes, Address, toNano, fromNano, getRandomNonce, convertAmount, zeroAddress } from "locklift";
const BigNumber = require("bignumber.js"); 
// const logger = require('mocha-logger');
const chai = require('chai');
// chai.use(require('chai-bignumber')());

const { expect, assert } = chai;

const Config = require("../scripts/utilsConfig.js"); 

let signer, owner, gameroot, router1, router2, cell1, cell2, cell3;
let cellCoord1 = {  x: 2,  y: 1,  z: -3  } // user1 start
let cellCoord2 = {  x: 2,  y: 2,  z: -4 } // user1 mark
let cellCoord3 = {  x: 3,  y: 1,  z: -4 } // user2 start

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
 
function arraysContainSame(a, b) {
  a = Array.isArray(a) ? a : [];
  b = Array.isArray(b) ? b : [];
  return a.length === b.length && a.every(el => b.includes(el));
}



describe(`Test Router contract (BASE)`, async function() {
  //this.timeout(20000000);
  let _randomNonce = locklift.utils.getRandomNonce().toString();
  
  it('Start 1', async () => {
    signer = (await locklift.keystore.getSigner("0"));
    console.log('signer publicKey', signer)
    console.log('_randomNonce', _randomNonce)
    // const { account: _owner } = await locklift.factory.accounts.addNewAccount({
      // publicKey: signer.publicKey,
      // type: WalletTypes.WalletV3,
      // value: toNano(100),
    // });
    const _owner = await locklift.factory.accounts.addExistingAccount({
      publicKey: signer.publicKey,
      type: WalletTypes.WalletV3,
    });
    owner = _owner;
    console.log(`Owner address: ${owner.address.toString()}`);
    console.log(`Owner pubkey: ${owner.publicKey.toString(16)}`);
  });
  
  it('Deploy game root', async () => {
    try {
      const Router = await locklift.factory.getContractArtifacts("Router");
      const Cell = await locklift.factory.getContractArtifacts("Cell");
      let { contract: _gameroot } = await locklift.tracing.trace(locklift.factory.deployContract({
        contract: "GameRoot",
        publicKey: signer.publicKey,
        initParams: {
          _nonce: _randomNonce,
        },
        constructorParams: {
          codeRouter: Router.code,
          codeCell: Cell.code,
          ownerPubkey: `0x${signer.publicKey}`,
        },
        value: toNano(2),
      }));
      gameroot = _gameroot;
      console.log(`Gameroot deployed at: ${gameroot.address.toString()}`);
      
      let details
      details = await gameroot.methods.getDetails().call();
      console.log('getDetails gameroot', details);
      expect(details.nonce)
          .to.be.equal(_randomNonce, 'Wrong nonce');
      expect(BigNumber(details.owner).toString(16).padStart("0", 64))
          .to.be.equal(signer.publicKey, 'Wrong public Key');
          
      let conf = Config.readConf();
      conf['localnet'] = conf['localnet'] || {}
      conf['localnet'].gameroot = gameroot.address.toString()
      Config.saveConf(conf)
    } catch(err) {
      console.log('error', err);
    }
  });
  
});

describe(`Test Router contract (BASE)`, async function() {
  it('Start Router1', async () => {
    let _nonceNewRouter = locklift.utils.getRandomNonce().toString();
    try {
      let res = await locklift.tracing.trace(gameroot.methods.newRouter({
          sendGasTo: owner.address.toString(),
          roundTime: 300,
          radius: 5,
          speed: 1,
          name: 'Test location radius:5 speed:1',
          nonce: _nonceNewRouter
      }).send({
          from: owner.address.toString(),
          amount: toNano(2),
      }));
      let eventsRouterCreated = await gameroot.getPastEvents({ filter: event => event.event === "RouterCreated" });
      let eventNewRouter = eventsRouterCreated.events[0].data;
      console.log('RouterCreated', eventNewRouter);
      expect(eventNewRouter.nonce)
          .to.be.equal(_nonceNewRouter, 'Wrong event nonce');

      let details
      router1 = locklift.factory.getDeployedContract(
        "Router",
        new Address(eventNewRouter.routerAddress.toString()),
      );
      details = await router1.methods.getDetails({}).call();
      console.log('getDetails router1', details);
      expect(details.owner.toString())
          .to.be.equal(gameroot.address.toString(), 'Wrong owner');

      let routerState = await locklift.factory.ever.getFullContractState({address: router1.address});
      console.log('routerState codeHash', routerState.state.codeHash);
          
      let conf = Config.readConf();
      conf['localnet'] = conf['localnet'] || {}
      conf['localnet'].router = router1.address.toString()
      conf['localnet'].codeHash = routerState.state.codeHash
      Config.saveConf(conf)
    } catch (err) {
      console.log('error', err);
    }
  });

  it('Start Router2', async () => {
    let _nonceNewRouter = locklift.utils.getRandomNonce().toString();
    try {
    let res = await locklift.tracing.trace(gameroot.methods.newRouter({
        sendGasTo: owner.address.toString(),
        roundTime: 3600,
        radius: 3,
        speed: 2,
        name: 'Test location radius:3 speed:2',
        nonce: _nonceNewRouter
    }).send({
        from: owner.address.toString(),
        amount: toNano(2),
    }));
    let eventsRouterCreated = await gameroot.getPastEvents({ filter: event => event.event === "RouterCreated" });
    let eventNewRouter = eventsRouterCreated.events[0].data;
    console.log('RouterCreated', eventNewRouter);
    expect(eventNewRouter.nonce)
        .to.be.equal(_nonceNewRouter, 'Wrong event nonce');

    let details
    router2 = locklift.factory.getDeployedContract(
      "Router",
      new Address(eventNewRouter.routerAddress.toString()),
    );
    details = await router2.methods.getDetails({}).call();
    console.log('getDetails router2', details);

    expect(details.owner.toString())
        .to.be.equal(gameroot.address.toString(), 'Wrong owner');
    } catch (err) {
      console.log('error', err);
    }
  });

});

describe(`Test Cell contract (BASE)`, async function() {
  it('Start Cell1 User1', async () => {
    
    let res = await locklift.tracing.trace(router1.methods.newGame({
        sendGasTo: owner.address.toString(),
        baseCoord: cellCoord1
    }).send({
        from: owner.address.toString(),
        amount: toNano(2),
    }));

    let details
    details = await router1.methods._resolveCell({ coord: cellCoord1 }).call();
    console.log('address cell1', details);

    cell1 = locklift.factory.getDeployedContract(
      "Cell",
      new Address(details.cellAddress.toString()),
    );
    details = await cell1.methods.getDetails({}).call();
    console.log('getDetails cell1', details);

    expect(details.level)
        .to.be.equal('0', 'Wrong level');

  });

  it('Mark Cell2 User1', async () => {
    
    let res = await locklift.tracing.trace(cell1.methods.markCell({
        sendGasTo: owner.address.toString(),
        targetCoord: cellCoord2,
        energy: 1000
    }).send({
        from: owner.address.toString(),
        amount: toNano(2),
    }));
    
    let details
    details = await cell1.methods.getDetails({}).call();
    console.log('getDetails cell1', details);

    details = await router1.methods._resolveCell({ coord: cellCoord2 }).call();
    console.log('address cell2', details);

    cell2 = locklift.factory.getDeployedContract(
      "Cell",
      new Address(details.cellAddress.toString()),
    );
    details = await cell2.methods.getDetails({}).call();
    console.log('getDetails cell2', details);

    expect(details.level)
        .to.be.equal('0', 'Wrong level');

  });

  it('Upgrade Cell2 User1', async () => {
    
    let res = await locklift.tracing.trace(cell2.methods.upgradeCell({
        sendGasTo: owner.address.toString(),
    }).send({
        from: owner.address.toString(),
        amount: toNano(1),
    }));
    
    let details
    details = await cell2.methods.getDetails({}).call();
    console.log('getDetails cell2', details);

    expect(details.level)
        .to.be.equal('1', 'Wrong level');

  });

  it('help Cell1 to Cell2 User1', async () => {
    
    let res = await locklift.tracing.trace(cell1.methods.helpCell({
        sendGasTo: owner.address.toString(),
        targetCoord: cellCoord2,
        energy: 500
    }).send({
        from: owner.address.toString(),
        amount: toNano(1),
    }));
    
    let details
    details = await cell1.methods.getDetails({}).call();
    console.log('getDetails cell1', details);

    details = await cell2.methods.getDetails({}).call();
    console.log('getDetails cell2', details);

    expect(details.level)
        .to.be.equal('1', 'Wrong level');

  });

  it('Start new game User2', async () => {
    
    let res = await locklift.tracing.trace(router1.methods.newGame({
        sendGasTo: owner.address.toString(),
        baseCoord: cellCoord3
    }).send({
        from: owner.address.toString(),
        amount: toNano(2),
    }));

    let details
    details = await router1.methods._resolveCell({ coord: cellCoord3 }).call();
    console.log('_resolveCell', details);

    cell3 = locklift.factory.getDeployedContract(
      "Cell",
      new Address(details.cellAddress.toString()),
    );
    details = await cell3.methods.getDetails({}).call();
    console.log('getDetails cell3', details);

    expect(details.level)
        .to.be.equal('0', 'Wrong level');

  });

  it('attk Cell3 to Cell1 User2', async () => {
    
    let res = await locklift.tracing.trace(cell3.methods.attkCell({
        sendGasTo: owner.address.toString(),
        targetCoord: cellCoord1,
        energy: 1000
    }).send({
        from: owner.address.toString(),
        amount: toNano(1),
    }));
    
    let details
    details = await cell1.methods.getDetails({}).call();
    console.log('getDetails cell1', details);

    details = await cell3.methods.getDetails({}).call();
    console.log('getDetails cell3', details);

    expect(details.level)
        .to.be.equal('0', 'Wrong level');

  });

});
