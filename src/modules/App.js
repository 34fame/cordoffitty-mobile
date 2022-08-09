import { useStore } from 'vuex'

import useTenant from './Tenants'
import useUser from './Users'
import useCommon from './common'

const modules = [
   'tenants',
   'orgs',
   'users',
   'services',
   'assets',
   'projects',
   'orders',
   'dispatch',
   // 'invoices',
   // 'reports',
   'settings',
]

export default function useApp() {
   const store = useStore()
   const tenant = useTenant()
   const user = useUser()
   const common = useCommon()

   const loadAll = async (options) => {
      return new Promise(async (res, rej) => {
         // console.group('App/loadAll')
         try {
            if (store.state.app.loading) return res(true)

            store.commit('app/setLoading', true)
            if (options.exclude) {
               if (!options.exclude?.includes('tenants')) await tenant.load()
               for (const module of modules) {
                  if (module === 'tenants') continue
                  if (!options.exclude?.includes(module))
                     await common.load(module)
                  // console.log(`loaded ${module}`)
               }
            } else {
               await tenant.load()
               for (const module of modules) {
                  if (module === 'tenants') continue
                  await common.load(module)
                  // console.log(`loaded ${module}`)
               }
            }
            res()
         } catch (error) {
            console.error('app/loadAll', error.message)
            rej(error)
         } finally {
            store.commit('app/setLoading', false)
            // console.groupEnd()
         }
      })
   }

   const permit = ({ module, action }) => {
      const isMasterTenant = store.getters['app/masterTenant']
      const role = store.getters['app/role']

      const permitted = {
         dashboard: {
            view: () => ['Admin', 'Manager', 'Auditor'].includes(role),
         },
         tenants: {
            view: () =>
               isMasterTenant && ['Admin', 'Manager', 'Auditor'].includes(role),
            add: () => isMasterTenant && ['Admin'].includes(role),
            update: () => isMasterTenant && ['Admin', 'Manager'].includes(role),
            delete: () => isMasterTenant && ['Admin'].includes(role),
         },
         orgs: {
            view: () => ['Admin', 'Manager', 'Auditor'].includes(role),
            add: () => ['Admin', 'Manager'].includes(role),
            update: () => ['Admin', 'Manager'].includes(role),
            delete: () => ['Admin', 'Manager'].includes(role),
         },
         users: {
            view: () => ['Admin', 'Manager', 'Auditor'].includes(role),
            add: () => ['Admin', 'Manager'].includes(role),
            update: () => ['Admin', 'Manager'].includes(role),
            delete: () => ['Admin', 'Manager'].includes(role),
         },
         services: {
            view: () => ['Admin', 'Manager', 'Auditor'].includes(role),
            add: () => ['Admin', 'Manager'].includes(role),
            update: () => ['Admin', 'Manager'].includes(role),
            delete: () => ['Admin', 'Manager'].includes(role),
         },
         assets: {
            view: () => ['Admin', 'Manager', 'Auditor'].includes(role),
            add: () => ['Admin', 'Manager'].includes(role),
            update: () => ['Admin', 'Manager'].includes(role),
            delete: () => ['Admin', 'Manager'].includes(role),
         },
         projects: {
            view: () => ['Admin', 'Manager', 'Auditor'].includes(role),
            add: () => ['Admin', 'Manager'].includes(role),
            update: () => ['Admin', 'Manager'].includes(role),
            delete: () => ['Admin', 'Manager'].includes(role),
         },
         orders: {
            view: () =>
               ['Admin', 'Manager', 'Auditor', 'Operator'].includes(role),
            add: () => ['Admin', 'Manager'].includes(role),
            update: () => ['Admin', 'Manager', 'Operator'].includes(role),
            delete: () => ['Admin', 'Manager'].includes(role),
         },
         requests: {
            view: () => ['Admin', 'Manager', 'Auditor'].includes(role),
            add: () => ['Admin', 'Manager'].includes(role),
            update: () => ['Admin', 'Manager'].includes(role),
            delete: () => ['Admin', 'Manager'].includes(role),
         },
         settings: {
            view: () => ['Admin', 'Manager'].includes(role),
         },
      }

      return permitted[module] && permitted[module][action]
         ? permitted[module][action]()
         : false
   }

   const coords = async (store_, coords) => {
      try {
         if (!store_.getters['app/loggedIn']) return null
         await user.update({
            id: store_.state.app.user.id,
            coords,
         })
         store_.commit('app/setCoords', coords)
      } catch (error) {
         console.error('modules/App', 'coords', error.message)
      }
   }

   return { loadAll, permit, coords }
}
