import { toNano } from "locklift";
const Config = require("../scripts/utilsConfig.js"); 

async function main() {

  let _randomNonce = locklift.utils.getRandomNonce().toString();

  let signer = (await locklift.keystore.getSigner("0"));
  let owner = await locklift.factory.accounts.addExistingAccount({
    publicKey: signer.publicKey,
    type: WalletTypes.WalletV3,
  });
  console.log('signer publicKey', signer)
  console.log('_randomNonce', _randomNonce)
  
  const Router = await locklift.factory.getContractArtifacts("Router");
  const Cell = await locklift.factory.getContractArtifacts("Cell");
  let { contract: _gameroot } = await locklift.factory.deployContract({
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
  });
  let gameroot = _gameroot;
  console.log(`Gameroot deployed at: ${gameroot.address.toString()}`);
  
  let _nonceNewRouter = locklift.utils.getRandomNonce().toString();
  let res = await gameroot.methods.newRouter({
      sendGasTo: owner.address.toString(),
      radius: 10,
      speed: 1,
      name: 'Test location radius:10 speed:1',
      nonce: _nonceNewRouter
  }).send({
      from: owner.address.toString(),
      amount: toNano(2),
  }));
  let eventsRouterCreated = await gameroot.getPastEvents({ filter: event => event.event === "RouterCreated" });
  let eventNewRouter = eventsRouterCreated.events[0].data;

  let routerState = await locklift.factory.ever.getFullContractState({address: eventNewRouter.routerAddress});
  console.log('routerState', routerState);

  let conf = Config.readConf();
  conf['testnet'] = conf['testnet'] || {}
  conf['testnet'].gameroot = gameroot.address.toString()
  conf['testnet'].router = eventNewRouter.routerAddress.toString()
  conf['testnet'].codeHash = routerState.state.codeHash;
  Config.saveConf(conf)
  
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
