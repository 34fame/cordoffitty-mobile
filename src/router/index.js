import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { logger } from 'boot/logger'

const createHistory = createWebHistory

const router = createRouter({
   scrollBehavior: () => ({ left: 0, top: 0 }),
   routes,
   history: createHistory(process.env.VUE_ROUTER_BASE),
})

export default route(function ({ store }) {
   router.beforeEach((to, from, next) => {
      if (to.name === 'index-tenant')
         return next({ name: 'login-tenant', params: to.params })
      const publicPaths = [
         'index',
         'index-tenant',
         'login',
         'login-tenant',
         'logout',
      ]
      const authenticated = store.getters['app/loggedIn']
      logger.info('router/index', 'authenticated', authenticated)
      logger.info('router/index', 'to', to.name)
      if (publicPaths.includes(to.name)) return next()

      if (!authenticated) return next({ name: 'login' })

      logger.info('router/index', 'next')
      next()
   })

   return router
})

export { router }
