import {
   collection,
   collectionGroup,
   doc,
   getDoc,
   getDocs,
   addDoc,
   updateDoc,
   deleteDoc,
} from 'firebase/firestore'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Notify } from 'quasar'

import { db } from 'boot/firebase'
import useHistory from 'src/modules/History'

export default function useCommon() {
   const route = useRoute()
   const router = useRouter()
   const store = useStore()
   const history = useHistory()

   const load = async (dataType) => {
      return new Promise(async (res, rej) => {
         try {
            // console.log(`modules/${dataType}`, 'load')
            store.commit(`${dataType}/setLoading`, true)
            const tenantId =
               store.state.tenants.selected || store.state.app.user.tenantId
            store.commit('tenants/setSelected', tenantId)
            const masterTenant = store.getters['app/masterTenant']

            store.commit(`${dataType}/clear`)
            let collectionRef = collection(db, 'tenants', tenantId, dataType)

            let snap = await getDocs(collectionRef)
            snap.forEach((doc) => {
               store.commit(`${dataType}/set`, {
                  id: doc.id,
                  ...doc.data(),
               })
            })

            if (masterTenant && dataType !== 'settings') {
               collectionRef = collectionGroup(db, dataType)
               snap = await getDocs(collectionRef)
               store.commit(`${dataType}/setCounter`, snap.docs.length)
            }
            store.commit(`${dataType}/setLoading`, false)
            res()
         } catch (error) {
            console.error('modules/common', 'load', error.message)
            rej()
         }
      })
   }

   const select = (dataType, id) => {
      store.commit(`${dataType}/setSelected`, id)
   }

   const loading = (dataType, value) => {
      store.commit(`${dataType}/setLoading`, value)
   }

   const filterBy = (dataType, value) => {
      store.commit(`${dataType}/setFilterBy`, value)
   }

   const groupBy = (dataType, value) => {
      store.commit(`${dataType}/setGroupBy`, value)
   }

   const add = async (dataType, data) => {
      try {
         const tenantId = data.tenantId || store.state.app.user.tenantId

         // Add record
         const result = await addDoc(
            collection(db, 'tenants', tenantId, dataType),
            data
         )

         // Add history
         history.add({
            tenantId,
            dataType,
            recordId: result.id,
            actionId: 'add',
            data,
         })

         // Add to state
         const docRef = doc(db, 'tenants', tenantId, dataType, result.id)
         const snap = await getDoc(docRef)
         store.commit(`${dataType}/set`, {
            id: snap.id,
            ...snap.data(),
         })

         Notify.create('Record added')
         router.push({
            name: dataType,
            params: { tenantId: tenantId },
         })
      } catch (error) {
         console.error('modules/common', 'add', error.message)
         Notify.create({ type: 'negative', message: 'Add failed' })
      }
   }

   const update = async (dataType, data) => {
      try {
         const tenantId = data.tenantId || store.state.app.user.tenantId
         const { id, ...rest } = data
         let docRef = doc(db, 'tenants', tenantId, dataType, id)
         await updateDoc(docRef, rest)

         // Add history
         history.add({
            tenantId,
            dataType,
            recordId: data.id,
            actionId: 'update',
            data: rest,
         })

         docRef = doc(db, 'tenants', tenantId, dataType, id)
         const snap = await getDoc(docRef)
         store.commit(`${dataType}/set`, {
            id: snap.id,
            ...snap.data(),
         })

         Notify.create('Record updated')
         // router.push({
         //    name: dataType,
         //    params: { tenantId: tenantId, id },
         // })
      } catch (error) {
         console.error('modules/common', 'update', error.message)
         Notify.create({ type: 'negative', message: 'Update failed' })
      }
   }

   const remove = async (dataType, id, tenantId) => {
      try {
         tenantId = tenantId || selectedTenantId
         const selectedId = id ? id : route.params.id
         const docRef = doc(db, 'tenants', tenantId, dataType, selectedId)

         const snap = await getDoc(docRef)
         const data = snap.data()

         await deleteDoc(docRef)

         // Add history
         history.add({
            tenantId,
            dataType,
            recordId: id,
            actionId: 'delete',
            data,
         })

         store.commit(`${dataType}/remove`, selectedId)

         Notify.create('Record deleted')
         router.push({
            name: dataType,
            params: { tenantId: tenantId },
         })
      } catch (error) {
         console.error('modules/common', 'remove', error.message)
         Notify.create({ type: 'negative', message: 'Delete failed' })
      }
   }

   const copy = async (dataType, id, tenantId) => {
      try {
         const data = store.state[dataType].items[id]
         await addDoc(collection(db, 'tenants', tenantId, dataType), data)

         Notify.create('Record copied')
      } catch (error) {
         console.error('modules/common', 'copy', error.message)
         Notify.create({ type: 'negative', message: 'Copy failed' })
      }
   }

   return {
      load,
      select,
      loading,
      filterBy,
      groupBy,
      add,
      update,
      remove,
      copy,
   }
}
