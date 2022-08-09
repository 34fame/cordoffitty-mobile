import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import LogRocket from 'logrocket'
import createPlugin from 'logrocket-vuex'

import app from './app'
import tenants from './tenants'
import orgs from './orgs'
import users from './users'
import services from './services'
import assets from './assets'
import projects from './projects'
import orders from './orders'
import dispatch from './dispatch'
import settings from './settings'

const logrocketPlugin = createPlugin(LogRocket)

const Store = createStore({
   modules: {
      app,
      tenants,
      orgs,
      users,
      services,
      assets,
      projects,
      orders,
      dispatch,
      settings,
   },
   plugins: [logrocketPlugin],
   strict: process.env.DEBUGGING,
})
export default store(function () {
   return Store
})

export { Store as store }
