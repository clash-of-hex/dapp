import { defineStore } from "pinia";
import {
  Address,
  ProviderRpcClient,
  TvmException,
} from "everscale-inpage-provider";
import { TonClient, signerKeys, signerNone } from "@eversdk/core";
import { libWeb } from "@eversdk/lib-web";
import { Account } from "@eversdk/appkit";

TonClient.useBinaryLibrary(libWeb);

import routerAbi from "../../../app/build/Router.abi.json";
import cellAbi from "../../../app/build/Cell.abi.json";
import rootAbi from "../../../app/build/GameRoot.abi.json";
import Config from "../../../../config.json";

export const counter = defineStore("counter", () => {
  const count = 1;
  function increment() {
    count.value++;
  }

  let currentMap = [];
  let onRoumingChange;

  const ever = new ProviderRpcClient({});

  let everClient;
  let subscribeAcc;

  const createClient = (endpoint) => {
    const client = new TonClient({
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
      const response = await everClient.tvm.run_tvm({
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

  async function disconnectAction() {
    console.log("disconnectAction");
    await ever.disconnect();
  }

  async function getRoutersAction() {
    clearTblRows("tblRouters", 3);
    console.log("getRoutersAction");
    const providerState = await ever.getProviderState();
    const details = await ever.getAccountsByCodeHash({
      codeHash: Config[providerState.selectedConnection].codeHash,
      limit: 50,
    });
    const addreses = details.accounts.map((el) => el.toString());
    console.log("routers", addreses);
    const accs = await getAccArr(addreses);
    console.log("routers", accs);
    for (let i = 0; i < accs.length; i++) {
      const details = await getDetailsRouter(accs[i].id, accs[i].boc);
      if (details) {
        let row, cell;
        const date = new Date(1000 * details.endTime);
        console.log("date", date);
        row = addTblRow("tblRouters");
        if (row) {
          cell = row.insertCell(0);
          cell.innerHTML = details.name;
          cell = row.insertCell(1);
          cell.innerHTML = details.userCount;
          cell = row.insertCell(2);
          // cell.innerHTML = details.radius;
          // cell = row.insertCell(3);
          // cell.innerHTML = details.speed;
          // cell = row.insertCell(4);
          // cell.innerHTML = date.customFormat("#DD#-#MM#-#YYYY# #hh#:#mm#:#ss#");
          // cell = row.insertCell(5);
          const btn = document.createElement("button");
          btn.textContent = "Set";
          btn.setAttribute("type", "button");
          btn.setAttribute("addr", accs[i].id);
          btn.onclick = setRouter;
          cell.appendChild(btn);
          cell = row.insertCell(3);
          cell.innerHTML = accs[i].id;
          cell.style = "visibility: hidden; width: 0px";
        }
        // cell.colSpan = "4"
        // cell.style="text-align:left;"
      }
    }
  }

  async function getLiderBoard() {
    console.log("getLiderBoard");
    const providerState = await ever.getProviderState();
    const details = await routerLiders();
    const users = details.users.map((el) => el.toString());
    console.log("users", users);
    clearTblRows("tblLiders", 1);
    for (let i = 0; i < users.length; i++) {
      const usr = users[i].split(",");
      let row, cell;
      row = addTblRow("tblLiders");
      cell = row.insertCell(0);
      cell.innerHTML = `${usr[0].substr(0, 6)}...${usr[0].substr(-4, 4)}`;
      cell = row.insertCell(1);
      cell.innerHTML = usr[1];
      // cell.colSpan = "4"
      // cell.style="text-align:left;"
    }
  }

  async function setRouter(el) {
    console.log("setRouter", el);
    const address = el.target.attributes.addr.value;
    console.log("address", address);
    const providerState = await ever.getProviderState();
    const network = providerState.selectedConnection;
    Config[network].router = address;
    for (const hex of currentMap) {
      hex.highlight = false;
      hex.details = undefined;
    }
    const details = await routerDetails();
    console.log("details", details);
    onRoumingChange(details.radius);
    loadMap();
    getLiderBoard();
  }

  async function addRouterAction() {
    const name = document.getElementById("router_name").value;
    const radius = document.getElementById("router_radius").value;
    const users = document.getElementById("router_users").value;
    const speed = document.getElementById("router_speed").value;
    const time = document.getElementById("router_time").value;
    console.log("addRouterAction", name, radius, speed, time);
    const providerState = await newRouter(name, radius, users, speed, time);
    await getRoutersAction();
  }

  async function connect() {
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
      const address = account.address.toString();
      const pubkey = account.publicKey.toString();
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
      behavior(
        "calcRewardsAction",
        (elem) => (elem.onclick = calcRewardsAction)
      );
      behavior(
        "claimRewardAction",
        (elem) => (elem.onclick = claimRewardAction)
      );
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
        (elem.style.display = to === screen ? "table-row" : "none");
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
    const coords = [];
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
    const accs = await getAccArr(addreses);
    console.log("accs", accs);
    for (let i = 0; i < accs.length; i++) {
      const details = await getDetailsCell(accs[i].id, accs[i].boc);
      if (details) {
        const hex = findHex(accs[i].id);
        console.log("hex", hex);
        if (hex) {
          hex.details = details;
        }
      }
    }
  }

  function setMap(map) {
    currentMap = map;
  }

  async function init(_onRoumingChange) {
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

  async function routerDetails() {
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

  async function routerLiders() {
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

  async function subscribeAllCellState(arrAcc) {
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
          const hex = findHex(msg.id);
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

  async function getAddressCells(coords) {
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

  async function newGame(cellCoord) {
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
      const res = await router.methods
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

  async function markCell(address, cellCoord, energy) {
    const providerState = await ever.getProviderState();
    const permissions = providerState.permissions;
    if (!permissions.accountInteraction) return;
    const account = permissions.accountInteraction;

    const cell = new ever.Contract(cellAbi, address);

    try {
      console.log("markCell", 1);
      const res = await cell.methods
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

  async function upgradeCell(address) {
    const providerState = await ever.getProviderState();
    const permissions = providerState.permissions;
    if (!permissions.accountInteraction) return;
    const account = permissions.accountInteraction;

    const cell = new ever.Contract(cellAbi, address);

    try {
      console.log("upgradeCell", 1);
      const res = await cell.methods
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

  async function helpCell(address, cellCoord, energy) {
    const providerState = await ever.getProviderState();
    const permissions = providerState.permissions;
    if (!permissions.accountInteraction) return;
    const account = permissions.accountInteraction;

    const cell = new ever.Contract(cellAbi, address);

    try {
      console.log("helpCell", 1);
      const res = await cell.methods
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

  async function attkCell(address, cellCoord, energy) {
    const providerState = await ever.getProviderState();
    const permissions = providerState.permissions;
    if (!permissions.accountInteraction) return;
    const account = permissions.accountInteraction;

    const cell = new ever.Contract(cellAbi, address);

    try {
      console.log("attkCell", 1);
      const res = await cell.methods
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

  async function newRouter(name, radius, users, speed, time) {
    const providerState = await ever.getProviderState();
    const permissions = providerState.permissions;
    if (!permissions.accountInteraction) return;
    const account = permissions.accountInteraction;

    const gameroot = new ever.Contract(
      rootAbi,
      Config[providerState.selectedConnection].gameroot
    );

    try {
      console.log("newRouter", 1);
      const res = await gameroot.methods
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

  async function getDetailsCell(address, boc = null) {
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

  async function getDetailsRouter(address, boc = null) {
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

  async function destroyCells() {
    const providerState = await ever.getProviderState();
    const permissions = providerState.permissions;
    if (!permissions.accountInteraction) return;
    const account = permissions.accountInteraction;

    const router = new ever.Contract(
      routerAbi,
      contractAddress(providerState.selectedConnection, "router")
    );

    const addreses = [];
    for (const hex of currentMap) {
      if (hex.details) {
        addreses.push(hex.address);
      }
    }
    console.log("addreses", addreses);
    if (!addreses.length) return;
    const accs = await getAccArr(addreses);
    const accDestroy = [];
    for (let i = 0; i < accs.length; i++) {
      if (accs[i].boc) {
        accDestroy.push(accs[i].id);
        if (accDestroy.length >= 10) break;
      }
    }

    if (!accDestroy.length) return;
    try {
      console.log("destroyCells", 1);
      const res = await router.methods
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

  async function calcRewards() {
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
      const res = await router.methods.calcRewards({}).send({
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

  async function claimReward() {
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
      const res = await router.methods.claimReward({}).send({
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

  async function getRewards() {
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

  async function subscribePermissionsChanged() {
    await ever.subscribe("permissionsChanged").on("data", (permissions) => {
      console.log(permissions);
    });
  }

  function addTblRow(tblName) {
    const table = document.getElementById(tblName);
    return table?.insertRow(table.rows.length);
  }

  function clearTblRows(tblName, min = 1) {
    const table = document.getElementById(tblName);
    while (table?.rows.length > min) table.deleteRow(table.rows.length - 1);
  }

  Date.prototype.customFormat = function (formatString) {
    let YYYY,
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
    const dateObject = this;
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

  return { setMap, init, connect, disconnectAction };
});
