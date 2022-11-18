import * as types from '@/store/mutation-types'

const getters = {
  allGames: state => state.allGames
}

const actions = {
  setAllGames({ commit }, payload) {
    commit(types.ALL_GAMES, payload);
  },
}

const mutations = {
  [types.ALL_GAMES](state, value) {
    state.allGames = value
  }
}

const state = {
  allGames: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
