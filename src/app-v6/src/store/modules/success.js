import * as types from '@/store/mutation-types'

const getters = {
  showSuccessMessage: state => state.successMessage,
  successMessage: state => state.successMessage,
}

const mutations = {
  [types.SUCCESS](state, payload) {
    if (payload === null) {
      state.showSuccessMessage = false
      state.successMessage = null
    } else {
      state.showSuccessMessage = true
      state.successMessage = payload.msg
    }
  },
  [types.SHOW_SUCCESS](state, payload) {
    state.showSuccessMessage = !!payload
  }
}

const state = {
  showSuccessMessage: false,
  successMessage: null,
}

export default {
  state,
  getters,
  mutations
}
