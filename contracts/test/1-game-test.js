import { WalletTypes, Address, toNano, fromNano, getRandomNonce, convertAmount, zeroAddress } from "locklift";
const BigNumber = require("bignumber.js"); 
// const logger = require('mocha-logger');
const chai = require('chai');
// chai.use(require('chai-bignumber')());

const { expect, assert } = chai;

const Config = require("../scripts/utilsConfig.js"); 

let signer, owner, router, cell1, cell2;

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
    const { account: _owner } = await locklift.factory.accounts.addNewAccount({
      publicKey: signer.publicKey,
      type: WalletTypes.WalletV3,
      value: toNano(100),
    });
    owner = _owner;
    console.log(`Owner: ${owner.publicKey.toString(16)}`);
  });
  
  it('Deploy router', async () => {
    
    const Cell = await locklift.factory.getContractArtifacts("Cell");
    let { contract: _router } = await locklift.factory.deployContract({
      contract: "Router",
      publicKey: signer.publicKey,
      initParams: {
        _nonce: _randomNonce,
      },
      constructorParams: {
        codeCell: Cell.code,
        ownerPubkey: `0x${signer.publicKey}`,
      },
      value: toNano(10),
    });
    router = _router;
    console.log(`Router deployed at: ${router.address.toString()}`);
    
    let details
    details = await router.methods.getDetails().call();
    console.log('getDetails router', details);
    expect(details.nonce)
        .to.be.equal(_randomNonce, 'Wrong nonce');
    expect(BigNumber(details.owner).toString(16).padStart("0", 64))
        .to.be.equal(signer.publicKey, 'Wrong public Key');
    let conf = Config.readConf();
    conf.router = router.address.toString()
    Config.saveConf(conf)
  });
  
  it('Start new game', async () => {
    let cellCoord = {
      x: 0,
      y: 0,
      z: 0
    }
    
    let res = await locklift.tracing.trace(router.methods.newGame({
        baseCoord: cellCoord
    }).send({
        from: owner.address.toString(),
        amount: toNano(2),
    }));

    let details
    details = await router.methods._resolveCell({ coord: cellCoord }).call();
    console.log('_resolveCell', details);

    cell1 = locklift.factory.getDeployedContract(
      "Cell",
      new Address(details.cellAddress.toString()),
    );
    details = await cell1.methods.getDetails({}).call();
    console.log('getDetails cell1 1', details);
    await sleep(2000);
    details = await cell1.methods.getDetails({}).call();
    console.log('getDetails cell1 2', details);

    expect(details.level)
        .to.be.equal('0', 'Wrong level');

  });

  it('Start new game in exist cell', async () => {
    let cellCoord = {
      x: 0,
      y: 0,
      z: 0
    }
    
    let res = await locklift.tracing.trace(router.methods.newGame({
        baseCoord: cellCoord
    }).send({
        from: owner.address.toString(),
        amount: toNano(2),
    }),
    {
      allowedCodes: {
        compute: [51],
        action: [],
      },
    });

  });
  
});

describe(`Test Cell contract (BASE)`, async function() {
  it('Mark Neighbor cell', async () => {
    let cellCoord = {
      x: 1,
      y: 0,
      z: -1
    }
    
    let res = await locklift.tracing.trace(cell1.methods.markCell({
        targetCoord: cellCoord,
        energy: 1000
    }).send({
        from: owner.address.toString(),
        amount: toNano(3),
    }));
    
    let details
    details = await cell1.methods.getDetails({}).call();
    console.log('getDetails cell1 3', details);

    details = await router.methods._resolveCell({ coord: cellCoord }).call();
    console.log('_resolveCell', details);

    cell2 = locklift.factory.getDeployedContract(
      "Cell",
      new Address(details.cellAddress.toString()),
    );
    details = await cell2.methods.getDetails({}).call();
    console.log('getDetails cell2', details);

    expect(details.level)
        .to.be.equal('0', 'Wrong level');

  });

});
