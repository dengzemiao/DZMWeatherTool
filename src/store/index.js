import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    // 最后一次发起请求的时间
    reqtime: ''
  },
  mutations: {
    SET_REQTIME: (state, reqtime) => {
      state.reqtime = reqtime
    }
  },
  actions: {
  },
  modules: {
  },
  // 使用插件
  plugins: [createPersistedState()]
})
