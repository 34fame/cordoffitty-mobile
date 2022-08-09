import useCommon from 'src/modules/common'
import { store } from 'src/store'
import { router } from 'src/router'
const route = router.currentRoute.value

export const globals = () => {
   const common = useCommon()

   try {
      const recordId = (dataType) => {
         if (route.name && route.name.startsWith(dataType) && route.params.id) {
            return route.params.id
         }

         let value
         switch (dataType) {
            case 'orgs':
               if (store.state.orgs.selected) {
                  value = store.state.orgs.selected
               } else {
                  common.select(dataType, store.state.app.user.orgId)
                  value = store.state.app.user.orgId
               }
               break
            case 'tenants':
               value =
                  store.state.tenants.selected ||
                  route.params.tenantId ||
                  store.state.app.user.tenantId
               break
            case 'users':
               if (store.state.users.selected) {
                  value = store.state.users.selected
               } else {
                  common.select(dataType, store.state.app.user.id)
                  value = store.state.app.user.id
               }
               break
            default:
               value = store.state[dataType].selected || ''
         }
         return value
      }

      const record = (dataType) => {
         const id = recordId(dataType)
         const item = store.state[dataType].items[id]
         if (item) {
            return {
               id,
               ...item,
            }
         }
         return {}
      }

      return {
         selectedId: (dataType) => {
            return recordId(dataType)
         },
         selectedRecord: (dataType) => {
            return record(dataType)
         },
      }
   } catch (error) {
      throw new Error(error)
   }
}
