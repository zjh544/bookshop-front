import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '', // 登录用0
    cartCount: 0, // 购物车图书数量
    socket: null, // socket
    socketMsg: '',
    requireMsg: '',
    showModal: false,
    requireDialog: false
  },
  mutations: {
    saveUserName(state, username) {
      state.username = username
    },
    saveCartCount(state, count) {
      state.cartCount = count
    },
    saveSocket(state, socket) {
      state.socket = socket
    },
    saveSocketMsg(state, socketMsg) {
      state.socketMsg = socketMsg
    },
    saveRequireMsg(state, requireMsg) {
      state.requireMsg = requireMsg
    },
    saveShowModal(state, showModal) {
      state.showModal = showModal
    },
    saveRequireDialog(state, requireDialog) {
      state.requireDialog = requireDialog
    }
  },
  actions: {
    saveUserName(context, username) {
      context.commit('saveUserName', username)
    },
    saveCartCount(context, count) {
      context.commit('saveCartCount', count)
    },
    saveSocket(context, socket) {
      context.commit('saveSocket', socket)
    },
    saveSocketMsg(context, socketMsg) {
      context.commit('saveSocketMsg', socketMsg)
    },
    saveRequireMsg(context, requireMsg) {
      context.commit('saveRequireMsg', requireMsg)
    },
    saveShowModal(context, showModal) {
      context.commit('saveShowModal', showModal)
    },
    saveRequireDialog(context, requireDialog) {
      context.commit('saveRequireDialog', requireDialog)
    }
  }
})
