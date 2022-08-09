import { doc, updateDoc } from 'firebase/firestore'
import { db } from 'boot/firebase'

const state = {
   user: {},
   coords: {
      lat: 0,
      lng: 0,
   },
   masterTenant: 'eCQmxb2krVxRUxMwNNP5',
   loading: false,
   debugLogs: [],
}

const mutations = {
   setUser(state, doc) {
      state.user = doc
   },

   setCoords(state, coords) {
      state.coords = coords
   },

   setLoading(state, value) {
      state.loading = value
   },

   addDebugLog(state, value) {
      let logEntry = ''
      logEntry += new Date().toISOString()
      logEntry += ' '
      logEntry += value
      state.debugLogs.push(logEntry)
   },

   clear(state) {
      state.user = {}
   },
}

const getters = {
   user: (state) => {
      return state.user
   },

   loggedIn: (state) => {
      return Object.keys(state.user).length > 0 ? true : false
   },

   tenant: (state) => {
      return state.user.tenantId
   },

   role: (state) => {
      return state.user.role
   },

   masterTenant: (state) => {
      return state.user.tenantId === state.masterTenant ? true : false
   },

   debugLogs: (state) => {
      return state.debugLogs
   },
}

const actions = {
   clear({ commit }) {
      commit('clear')
      commit('tenants/clear', null, { root: true })
      commit('orgs/clear', null, { root: true })
      commit('users/clear', null, { root: true })
      commit('services/clear', null, { root: true })
      commit('assets/clear', null, { root: true })
      commit('projects/clear', null, { root: true })
      commit('orders/clear', null, { root: true })
   },

   setCoords({ state, commit }, coords) {
      if (state.user.tenantId) {
         const tenantId = state.user.tenantId
         let docRef = doc(db, 'tenants', tenantId, 'users', state.user.id)
         updateDoc(docRef, { coords })
         commit('setCoords', coords)
      }
   },
}

export default {
   namespaced: true,
   getters,
   mutations,
   actions,
   state,
}
