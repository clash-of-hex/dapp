import {
  Address,
  ProviderRpcClient,
  TvmException,
} from "everscale-inpage-provider";
// import {
//   EverscaleStandaloneClient,
//   SimpleKeystore,
//   SimpleAccountsStorage,
//   WalletV3Account,
// } from "everscale-standalone-client";
import { TonClient, signerKeys, signerNone } from "@eversdk/core";
import { libWeb } from "@eversdk/lib-web";
import { Account } from "@eversdk/appkit";

TonClient.useBinaryLibrary(libWeb);

import routerAbi from "../../../app/build/Router.abi.json";
import cellAbi from "../../../app/build/Cell.abi.json";
import rootAbi from "../../../app/build/GameRoot.abi.json";
import Config from "../../../../config.json";

let currentMap = [];
let onRoumingChange;

const ever = new ProviderRpcClient({});

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
  return client;
};

const getAccount = (abi, address = "", keys = null) => {
  try {
    return new Account(
      { abi },
      {
        address: address,
        signer: keys ? signerKeys(keys) : signerNone(),
        client: everClient,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const getAccArr = async (addreses) => {
  try {
    const result = (
      await everClient.net.query_collection({
        collection: "accounts",
        filter: {
          id: {
            in: addreses,
          },
        },
        result: "id acc_type balance boc",
      })
    ).result;

    return result;
  } catch (error) {
    console.error(error);
  }
};

const runLocal = async (
  abi,
  address,
  functionName,
  input = {},
  log = true,
  boc = null
) => {
  try {
    const [account, message] = await Promise.all([
      boc ||
        everClient.net
          .query_collection({
            collection: "accounts",
            filter: { id: { eq: address } },
            result: "boc",
          })
          .then(({ result }) => result[0].boc)
          .catch(() => {
            return undefined;
          }),
      everClient.abi
        .encode_message({
          abi: {
            type: "Contract",
            value: abi,
          },
          address,
          call_set: {
            function_name: functionName,
            input: input,
          },
          signer: { type: "None" },
        })
        .then(({ message }) => message),
    ]);
    if (!account) return undefined;
    let response = await everClient.tvm.run_tvm({
      message: message,
      account: account,
      abi: {
        type: "Contract",
        value: abi,
      },
    });
    if (log) console.log("output:", response.decoded.output);

    return response.decoded.output;
  } catch (error) {
    console.error(error, functionName, input);
  }
};

function behavior(name, fn) {
  document.querySelectorAll(`[data-behavior=${name}]`).forEach(fn);
}

const innerText = (text) => (elem) => {
  elem.innerText = text;
};

function requestPermissions() {
  return ever.requestPermissions({
    permissions: ["basic", "accountInteraction"],
  });
}

export async function disconnectAction() {
  console.log("disconnectAction");
  await ever.disconnect();
}

async function getRoutersAction() {
  clearTblRows("tblRouters", 2);
  console.log("getRoutersAction");
  let topLiders = {};
  const providerState = await ever.getProviderState();
  let details = await ever.getAccountsByCodeHash({
    codeHash: Config[providerState.selectedConnection].codeHash,
    limit: 50,
  });
  let addreses = details.accounts.map((el) => el.toString());
  console.log("routers addreses", addreses);
  let accs = await getAccArr(addreses);
  for (let i = 0; i < accs.length; i++) {
    accs[i].details = await getDetailsRouter(accs[i].id, accs[i].boc);
    accs[i].liders = await getUsersRouter(accs[i].id, accs[i].boc);
  }
  accs = accs.sort((a, b) => (a.details.endTime == 0 || b.details.endTime == 0) ? 1*a.details.endTime - 1*b.details.endTime : 1*b.details.endTime - 1*a.details.endTime);
  for (let i = 0; i < accs.length; i++) {
    let details = accs[i].details;
    let liders = accs[i].liders;
    if (details && liders) {
      let row, cell;
      // var endDate = new Date(1000 * details.endTime);
      // console.log("date", endDate);
      //console.log("details", details);
      row = addTblRow("tblRouters");
      if (row) {
        cell = row.insertCell(0);
        cell.innerText = details.name.slice(0, 17);
        cell = row.insertCell(1);
        cell.innerHTML = `<div class="flex items-center"><img src="/users.svg" style="max-width: 20px; height: 10px; margin-right: 10px;"/> ${
          Object.keys(liders.users).length
        }/${details.userCount}</div>`;
        cell = row.insertCell(2);
        // cell.innerHTML = details.radius;
        // cell = row.insertCell(3);
        // cell.innerHTML = details.speed;
        // cell = row.insertCell(4);
        // cell.innerHTML = endDate.customFormat("#DD#-#MM#-#YYYY# #hh#:#mm#:#ss#");
        // cell = row.insertCell(5);
        var btn = document.createElement("button");
        let gameStarted = details.userCount * 1 > 0 &&
        Object.keys(liders.users).length >= details.userCount * 1;
        btn.textContent = gameStarted ? "Info" : "Join";
        btn.setAttribute("type", "button");
        if (gameStarted){
          btn.setAttribute("class", "button-info");
        } else {
          btn.setAttribute("class", "button-join");
        }
        btn.setAttribute("addr", accs[i].id);
        btn.onclick = setRouter;
        cell.appendChild(btn);
        // cell = row.insertCell(3);
        // cell.innerHTML = accs[i].id;
        // cell.style = "visibility: hidden; width: 0px";
      }
      // cell.colSpan = "4"
      // cell.style="text-align:left;"
      for (let key of Object.keys(liders.users)) {
        topLiders[key] = (topLiders[key] || 0) + 1 * liders.users[key];
      }
    }
  }
  topLiders = Object.entries(topLiders).map(([key, value]) => ({ key, value }));
  topLiders.sort((a, b) => b.value - a.value);
  console.log("topLiders", topLiders);
  clearTblRows("tblLiders");
  for (let lider of topLiders) {
    let row, cell;
    row = addTblRow("tblLiders");
    cell = row.insertCell(0);
    cell.innerHTML = `${lider.key.substr(0, 6)}...${lider.key.substr(-4, 4)}`;
    cell = row.insertCell(1);
    cell.innerHTML = lider.value;
  }
}

async function getLiderBoard() {
  console.log("getLiderBoard");
  const providerState = await ever.getProviderState();
  let details = await routerLiders();
  // let users = details.users.map((el) => el.toString());
  console.log("users", details.users);
  console.log("colors", details.colors);
  clearTblRows("tblUsers", 1);
  details.users = details.users.sort((a, b) => 1*b[1] - 1*a[1]);
  for (let i = 0; i < details.users.length; i++) {
    let usrAddr = details.users[i][0].toString();
    let usrColor = details.colors[i][1];
    let row, cell;
    row = addTblRow("tblUsers");
    cell = row.insertCell(0);
    cell.innerHTML = `${usrAddr.substr(0, 6)}...${usrAddr.substr(-4, 4)}`;
    cell.style = `color: rgb(${usrColor.r},${usrColor.g},${usrColor.b});`;
    cell = row.insertCell(1);
    cell.innerHTML = details.users[i][1];
    // cell.colSpan = "4"
    // cell.style="text-align:left;"
  }
}

const formatSeconds = (secs) => {
  const pad = (n) => n < 10 ? `0${n}` : n;

  const h = Math.floor(secs / 3600);
  const m = Math.floor(secs / 60) - (h * 60);
  const s = Math.floor(secs - h * 3600 - m * 60);

  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

async function setRouter(el) {
  let address = el.target.attributes.addr.value;
  const providerState = await ever.getProviderState();
  const network = providerState.selectedConnection;
  Config[network].router = address;
  for (let hex of currentMap) {
    hex.highlight = false;
    hex.details = undefined;
  }
  let details = await routerDetails();
  // let endDate = Date.now() - details.endTime;
  let currentTime = Date.now();
  let endDate = 1000 * details.endTime;
  let timeLeft = 0;
  let interval = null;
  clearInterval(interval);
  behavior("timeLeft", (elem) => {
    elem.innerText = "";
  });

  if (endDate > 0) {
    if (currentTime < endDate) {
      timeLeft = (endDate - currentTime) / 1000;
      behavior("timeLeft", (elem) => {
        interval = setInterval(() => {
          if (timeLeft >= 0) {
            elem.innerText = 'Time left: ' + formatSeconds(timeLeft);
            timeLeft -= 1;
          } else {
            elem.innerText = "Round ended";
            clearInterval(interval);
            interval = null;
          }
        }, 1000);
      });
    } else {
      behavior("timeLeft", (elem) => {
        elem.innerText = "Round ended";
      });
    }
  } else {
    behavior("timeLeft", (elem) => {
      elem.innerText = "Round not started";
    });
  }
  behavior("rommName", (elem) => {
    elem.innerText = details.name;
  });
  console.log("details", details);
  onRoumingChange(details.radius);
  loadMap();
  getLiderBoard();
}

async function addRouterAction() {
  // debugger;
  let name = document.getElementById("router_name").value;
  // let radius = document.getElementById("router_radius").value;
  let users = document.getElementById("router_users").value;
  // let speed = document.getElementById("router_speed").value;
  // let time = document.getElementById("router_time").value;
  if (name.length < 3) return;
  const providerState = await newRouter(name, users);
  await getRoutersAction();
  document.getElementById("router_name").value = '';
}

export async function connect() {
  await ever.requestPermissions({
    permissions: ["basic", "accountInteraction"],
  });
}

async function checkConnect() {
  console.log("checkConnect");
  const providerState = await ever.getProviderState();
  const permissions = providerState.permissions;
  const network = providerState.selectedConnection;
  if (!contractAddress(network) || !permissions.accountInteraction) {
    behavior("connect", (elem) => (elem.onclick = requestPermissions));
    switchScreen("login");
    const connectText = (elem) => {
      const disabled = !contractAddress(network);
      elem.disabled = disabled;
      elem.innerText = disabled
        ? `Contract not found`
        : `Connect with ${network}`;
    };
    behavior("connect", connectText);
  } else {
    // INFO for transactionsFound and contractStateChanged need permissions
    const providerState = await ever.getProviderState();
    (
      await ever.subscribe("contractStateChanged", {
        address: contractAddress(providerState.selectedConnection),
      })
    ).on("data", (event) => {
      console.log("permissionsChanged:", {
        address: event.address,
        state: event.state,
      });
    });
    switchScreen("main");
    const account = permissions.accountInteraction;
    let address = account.address.toString();
    let pubkey = account.publicKey.toString();
    behavior(
      "address",
      innerText(`${address.substr(0, 6)}...${address.substr(-4, 4)}`)
    );
    behavior(
      "publicKey",
      innerText(`${pubkey.substr(0, 6)}...${pubkey.substr(-4, 4)}`)
    );
    behavior("disconnectAction", (elem) => (elem.onclick = disconnectAction));
    behavior("getRoutersAction", (elem) => (elem.onclick = getRoutersAction));
    behavior("addRouterAction", (elem) => (elem.onclick = addRouterAction));
    behavior("calcRewardsAction", (elem) => (elem.onclick = calcRewardsAction));
    behavior("claimRewardAction", (elem) => (elem.onclick = claimRewardAction));
    behavior(
      "destroyCellsAction",
      (elem) => (elem.onclick = destroyCellsAction)
    );

    console.log("endpoint:", Config[network].endpoint);
    everClient = createClient(Config[network].endpoint);
    subscribeAcc = getAccount({});

    // loadMap();
    await getRoutersAction();
  }
}

async function setNetworkChanged(network) {
  const mod = network === "mainnet" ? "success" : "secondary";
  const out = `<span class="badge bg-${mod}">${network}</span>`;
  behavior("network", (elem) => (elem.innerHTML = out));
  await checkConnect();
}

function contractAddress(network, name = "router") {
  if (Config[network] && Config[network][name]) {
    return new Address(Config[network][name]);
  }
  return null;
}

function switchScreen(to) {
  console.log("switchScreen:", to);
  ["extension", "login", "main"].forEach((screen) => {
    const switcher = (elem) =>
      (elem.style.display = to === screen ? "block" : "none");
    behavior(screen, switcher);
  });
}

async function mainFlow() {
  const providerState = await ever.getProviderState();
  console.log("selectedConnection:", providerState.selectedConnection);
  await setNetworkChanged(providerState.selectedConnection);
  (await ever.subscribe("networkChanged")).on("data", (event) => {
    console.log("networkChanged:", event.selectedConnection);
    setNetworkChanged(event.selectedConnection);
  });
  (await ever.subscribe("permissionsChanged")).on("data", async (event) => {
    console.log("permissionsChanged:", event.permissions);
    await checkConnect();
  });
}

async function loadMap() {
  let coords = [];
  for (const hex of currentMap) {
    coords.push({ x: hex.q, y: hex.r, z: hex.s });
  }

  // console.log('coords', coords);
  let addreses = await getAddressCells(coords);
  addreses = addreses.map((el) => el.toString());
  let i = 0;
  for (const hex of currentMap) {
    hex.address = addreses[i].toString();
    i++;
  }
  // console.log('addreses', addreses);
  await subscribeAllCellState(addreses);
  let accs = await getAccArr(addreses);
  console.log("accs", accs);
  for (let i = 0; i < accs.length; i++) {
    let details = await getDetailsCell(accs[i].id, accs[i].boc);
    if (details) {
      let hex = findHex(accs[i].id);
      console.log("hex", hex);
      if (hex) {
        hex.details = details;
      }
    }
  }
}

export function setMap(map) {
  currentMap = map;
}

export async function init(_onRoumingChange) {
  onRoumingChange = _onRoumingChange;
  if (await ever.hasProvider()) {
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
  const router = new ever.Contract(
    routerAbi,
    contractAddress(providerState.selectedConnection, "router")
  );
  try {
    let details;
    details = await router.methods.getDetails({}).call();
    console.log("getDetails router", details);
    return details;
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }
}

export async function routerLiders() {
  const providerState = await ever.getProviderState();
  const router = new ever.Contract(
    routerAbi,
    contractAddress(providerState.selectedConnection, "router")
  );
  try {
    let details;
    details = await router.methods.getUsers({}).call();
    console.log("getUsers router", details);
    return details;
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }
}

export async function subscribeAllCellState(arrAcc) {
  try {
    const providerState = await ever.getProviderState();
    (
      await ever.subscribe("contractStateChanged", {
        address: contractAddress(providerState.selectedConnection),
      })
    ).on("data", (event) => {
      getLiderBoard();
    });

    await subscribeAcc.free();
    await subscribeAcc.subscribe(
      "accounts",
      {
        id: { in: arrAcc },
      },
      "id boc",
      async (msg) => {
        console.log(`onAcc:`, msg.id);
        let hex = findHex(msg.id);
        console.log("hex", hex);
        if (hex) {
          hex.details = await getDetailsCell(msg.id, msg.boc);
        }
      },
      async (msg) => {
        console.log(`onError:`, msg);
      }
    );
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }
}

export async function getAddressCells(coords) {
  const providerState = await ever.getProviderState();
  const router = new ever.Contract(
    routerAbi,
    contractAddress(providerState.selectedConnection, "router")
  );

  try {
    let details;
    details = await router.methods.getAddressCells({ coords }).call();
    console.log("getAddressCells router", details);
    return details.addreses;
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

  const router = new ever.Contract(
    routerAbi,
    contractAddress(providerState.selectedConnection, "router")
  );

  try {
    console.log("newGame", 1);
    let res = await router.methods
      .newGame({
        baseCoord: cellCoord,
      })
      .send({
        from: account.address.toString(),
        amount: "12000000000",
      });
    console.log("newGame", res);
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
    console.log("markCell", 1);
    let res = await cell.methods
      .markCell({
        targetCoord: cellCoord,
        energy: energy,
      })
      .send({
        from: account.address.toString(),
        amount: "2000000000",
      });
    console.log("markCell", res);
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
    console.log("upgradeCell", 1);
    let res = await cell.methods
      .upgradeCell({
        // }).sendExternal({ publicKey: account.publicKey.toString() })
      })
      .send({
        from: account.address.toString(),
        amount: "1000000000",
      });
    console.log("upgradeCell", res);
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
    console.log("helpCell", 1);
    let res = await cell.methods
      .helpCell({
        targetCoord: cellCoord,
        energy: energy,
      })
      .send({
        from: account.address.toString(),
        amount: "1000000000",
      });
    console.log("helpCell", res);
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
    console.log("attkCell", 1);
    let res = await cell.methods
      .attkCell({
        targetCoord: cellCoord,
        energy: energy,
      })
      .send({
        from: account.address.toString(),
        amount: "1000000000",
      });
    console.log("attkCell", res);
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }
}

export async function newRouter(name, users) {
  const providerState = await ever.getProviderState();
  const permissions = providerState.permissions;
  if (!permissions.accountInteraction) return;
  const account = permissions.accountInteraction;

  const gameroot = new ever.Contract(
    rootAbi,
    Config[providerState.selectedConnection].gameroot
  );
  if (users <= 1) users = 2;
  let time = 1200; //20 min
  let radius = 1 * users;
  let speed = 1;
  try {
    console.log("newRouter", 1);
    let res = await gameroot.methods
      .newRouter({
        roundTime: time,
        radius: radius,
        speed: speed,
        userCount: users,
        name: name,
        nonce: "0",
      })
      .send({
        from: account.address.toString(),
        amount: "2000000000",
      });
    console.log("newRouter", res);
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
      const output = await runLocal(
        cellAbi,
        address,
        "getDetails",
        {},
        true,
        boc
      );
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
    let details;
    details = await cell.methods.getDetails({}).call();
    console.log("getDetails cell", details);
    return details;
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }
}

export async function getDetailsRouter(address, boc = null) {
  if (boc) {
    try {
      const output = await runLocal(
        routerAbi,
        address,
        "getDetails",
        {},
        true,
        boc
      );
      return output;
    } catch (error) {
      console.error(error);
    }
  }
  const router = new ever.Contract(routerAbi, address);
  try {
    const stateRes = await router.getFullState();
    if (stateRes.state == null || !stateRes.state.isDeployed) {
      return null;
    }
    //console.log('state', stateRes.state);
    let details;
    details = await router.methods.getDetails({}).call();
    console.log("getDetails router", details);
    return details;
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }
}

export async function getUsersRouter(address, boc = null) {
  if (boc) {
    try {
      const output = await runLocal(
        routerAbi,
        address,
        "getUsers",
        {},
        true,
        boc
      );
      return output;
    } catch (error) {
      console.error(error);
    }
  }
  const router = new ever.Contract(routerAbi, address);
  try {
    const stateRes = await router.getFullState();
    if (stateRes.state == null || !stateRes.state.isDeployed) {
      return null;
    }
    //console.log('state', stateRes.state);
    let details;
    details = await router.methods.getUsers({}).call();
    console.log("getUsers router", details);
    return details;
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }
}

async function calcRewardsAction() {
  await calcRewards();
  await getRewards();
}

async function claimRewardAction() {
  claimReward();
}

async function destroyCellsAction() {
  destroyCells();
}

export async function destroyCells() {
  const providerState = await ever.getProviderState();
  const permissions = providerState.permissions;
  if (!permissions.accountInteraction) return;
  const account = permissions.accountInteraction;

  const router = new ever.Contract(
    routerAbi,
    contractAddress(providerState.selectedConnection, "router")
  );

  let addreses = [];
  for (const hex of currentMap) {
    if (hex.details) {
      addreses.push(hex.address);
    }
  }
  console.log("addreses", addreses);
  if (!addreses.length) return;
  let accs = await getAccArr(addreses);
  let accDestroy = [];
  for (let i = 0; i < accs.length; i++) {
    if (accs[i].boc) {
      accDestroy.push(accs[i].id);
      if (accDestroy.length >= 10) break;
    }
  }

  if (!accDestroy.length) return;
  try {
    console.log("destroyCells", 1);
    let res = await router.methods
      .destroyCells({
        cells: accDestroy,
      })
      .send({
        from: account.address.toString(),
        amount: "10000000000",
      });
    console.log("destroyCells", res);
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }
}

export async function calcRewards() {
  const providerState = await ever.getProviderState();
  const permissions = providerState.permissions;
  if (!permissions.accountInteraction) return;
  const account = permissions.accountInteraction;

  const router = new ever.Contract(
    routerAbi,
    contractAddress(providerState.selectedConnection, "router")
  );

  try {
    console.log("calcRewards", 1);
    let res = await router.methods.calcRewards({}).send({
      from: account.address.toString(),
      amount: "2000000000",
    });
    console.log("calcRewards", res);
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }
}

export async function claimReward() {
  const providerState = await ever.getProviderState();
  const permissions = providerState.permissions;
  if (!permissions.accountInteraction) return;
  const account = permissions.accountInteraction;

  const router = new ever.Contract(
    routerAbi,
    contractAddress(providerState.selectedConnection, "router")
  );

  try {
    console.log("claimReward", 1);
    let res = await router.methods.claimReward({}).send({
      from: account.address.toString(),
      amount: "1000000000",
    });
    console.log("claimReward", res);
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }
}

export async function getRewards() {
  const providerState = await ever.getProviderState();
  const router = new ever.Contract(
    routerAbi,
    contractAddress(providerState.selectedConnection, "router")
  );

  try {
    let details;
    details = await router.methods.getRewards({}).call();
    console.log("getRewards router", details);
    return details.rewards;
  } catch (e) {
    console.error(e);
    if (e instanceof TvmException) {
      console.error(e.code);
    }
  }
}

export async function subscribePermissionsChanged() {
  await ever.subscribe("permissionsChanged").on("data", (permissions) => {
    console.log(permissions);
  });
}

function addTblRow(tblName) {
  var table = document.getElementById(tblName);
  return table?.insertRow(table.rows.length);
}

function clearTblRows(tblName, min = 1) {
  var table = document.getElementById(tblName);
  while (table?.rows.length > min) table.deleteRow(table.rows.length - 1);
}

Date.prototype.customFormat = function (formatString) {
  var YYYY,
    YY,
    MMMM,
    MMM,
    MM,
    M,
    DDDD,
    DDD,
    DD,
    D,
    hhhh,
    hhh,
    hh,
    h,
    mm,
    m,
    ss,
    s,
    ampm,
    AMPM,
    dMod,
    th;
  var dateObject = this;
  YY = ((YYYY = dateObject.getFullYear()) + "").slice(-2);
  MM = (M = dateObject.getMonth() + 1) < 10 ? "0" + M : M;
  MMM = (MMMM = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][M - 1]).substring(0, 3);
  DD = (D = dateObject.getDate()) < 10 ? "0" + D : D;
  DDD = (DDDD = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][dateObject.getDay()]).substring(0, 3);
  th =
    D >= 10 && D <= 20
      ? "th"
      : (dMod = D % 10) == 1
      ? "st"
      : dMod == 2
      ? "nd"
      : dMod == 3
      ? "rd"
      : "th";
  formatString = formatString
    .replace("#YYYY#", YYYY)
    .replace("#YY#", YY)
    .replace("#MMMM#", MMMM)
    .replace("#MMM#", MMM)
    .replace("#MM#", MM)
    .replace("#M#", M)
    .replace("#DDDD#", DDDD)
    .replace("#DDD#", DDD)
    .replace("#DD#", DD)
    .replace("#D#", D)
    .replace("#th#", th);

  h = hhh = dateObject.getHours();
  if (h == 0) h = 24;
  if (h > 12) h -= 12;
  hh = h < 10 ? "0" + h : h;
  hhhh = hhh < 10 ? "0" + hhh : hhh;
  AMPM = (ampm = hhh < 12 ? "am" : "pm").toUpperCase();
  mm = (m = dateObject.getMinutes()) < 10 ? "0" + m : m;
  ss = (s = dateObject.getSeconds()) < 10 ? "0" + s : s;
  return formatString
    .replace("#hhhh#", hhhh)
    .replace("#hhh#", hhh)
    .replace("#hh#", hh)
    .replace("#h#", h)
    .replace("#mm#", mm)
    .replace("#m#", m)
    .replace("#ss#", ss)
    .replace("#s#", s)
    .replace("#ampm#", ampm)
    .replace("#AMPM#", AMPM);
};
