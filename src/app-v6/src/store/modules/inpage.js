/* eslint-disable */
import * as types from '@/store/mutation-types'
import { store } from '@/store'
import { buildSuccess, handleError } from '@/utils/utils.js'

import { Address, ProviderRpcClient, TvmException } from 'everscale-inpage-provider';

const ever = new ProviderRpcClient();
let onWalletConnect = null;

function requestPermissions() {
    return ever.requestPermissions({
        permissions: [
            'basic',
            'accountInteraction',
        ],
    });
}

const getters = {
  screenWallet: state => state.screenWallet,
  network: state => state.network,
  account: state => state.account,
}

const actions = {
  initWallet({ commit }, payload) {
    return new Promise(async (resolve, reject) => {
      if ((await ever.hasProvider())) {
        try {
          await ever.ensureInitialized();
          const providerState = await ever.getProviderState();
          commit(types.NETWORK_CHANGED, providerState.selectedConnection);
          store.dispatch('checkConnect');
          onWalletConnect = payload.onWalletConnect;
          (await ever.subscribe('networkChanged')).on('data', event => {
            console.log('networkChanged:', event.selectedConnection);
            commit(types.NETWORK_CHANGED, event.selectedConnection);
            store.dispatch('checkConnect');
          });
          (await ever.subscribe('permissionsChanged')).on('data', async (event) => {
            console.log('permissionsChanged:', event.permissions);
            store.dispatch('checkConnect');
          });
        } catch (error) {
          reject(error);
        }
        resolve();
      } else {
        commit(types.SCREEN_WALLET, "extension");
      }
    })
  },
  checkConnect({ commit }, payload) {
    console.log('checkConnect:', payload);
    return new Promise(async (resolve, reject) => {
      const providerState = await ever.getProviderState();
      const permissions = providerState.permissions;
      console.log('permissions:', permissions);
      if (!permissions.accountInteraction) {
        console.log('SCREEN_WALLET:', "login");
        commit(types.SCREEN_WALLET, "login");
      } else {
        console.log('SCREEN_WALLET:', "main");
        commit(types.SCREEN_WALLET, "main");
        commit(types.ACCOUNT, permissions.accountInteraction);
        if (onWalletConnect) onWalletConnect(providerState);
      }
      resolve();
    })
  },
  connectWallet({ commit }, payload) {
    ever.requestPermissions({
        permissions: [
            'basic',
            'accountInteraction',
        ],
    });
  },
  disconnectWallet({ commit }, payload) {
    ever.disconnect();
  },
  getContract({ commit }, payload) {
    return new ever.Contract(payload.abi, payload.address);
  },
  subscribeContract({ commit }, payload) {
    console.log('subscribeContract', payload);
    return new Promise(async (resolve, reject) => {
      if (typeof payload.address == 'string') payload.address = new Address(payload.address);
      (await ever.subscribe(payload.eventName, {
          address: payload.address,
      })).on('data', payload.onEvent);
      resolve();
    })
  },
  getAccountsByCodeHash({ commit }, payload) {
    return new Promise(async (resolve, reject) => {
      let details = await ever.getAccountsByCodeHash({
        codeHash: payload.codeHash,
        limit: 50,
      });
      resolve(details);
    })
  },
}

const mutations = {
  [types.SCREEN_WALLET](state, screenWallet) {
    state.screenWallet = screenWallet
  },
  [types.NETWORK_CHANGED](state, network) {
    state.network = network
  },
  [types.ACCOUNT](state, account) {
    state.account = account
  },
}

const state = {
  screenWallet: 'extension',
  network: 'mainnet',
  account: null,
}

export default {
  state,
  getters,
  actions,
  mutations
}



