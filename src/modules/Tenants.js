import {
   collection,
   doc,
   getDoc,
   getDocs,
   addDoc,
   updateDoc,
   deleteDoc,
   query,
   where,
} from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Notify } from 'quasar'

import { db } from 'boot/firebase'
import useCommon from './common'
import useHistory from 'src/modules/History'

const dataType = 'tenants'

export default function useTenant() {
   const common = useCommon()
   const router = useRouter()
   const store = useStore()
   const history = useHistory()

   const load = async () => {
      return new Promise(async (res, rej) => {
         try {
            store.commit(`${dataType}/clear`)
            const collectionRef = collection(db, dataType)
            const snap = await getDocs(collectionRef)

            if (snap.empty) {
               return res()
            }

            snap.forEach((doc) => {
               store.commit(`${dataType}/set`, {
                  id: doc.id,
                  ...doc.data(),
               })
            })
            res()
         } catch (error) {
            console.error(`modules/${dataType}`, 'load', error.message)
            rej()
         }
      })
   }

   const select = (id) => {
      common.select(dataType, id)
   }

   const loading = (value) => {
      common.loading(dataType, value)
   }

   const filterBy = (value) => {
      common.filterBy(dataType, value)
   }

   const groupBy = (value) => {
      common.groupBy(dataType, value)
   }

   const add = async (data) => {
      try {
         const nameEncoded = encodeURIComponent(data.name)
         const photoUrl = `https://avatars.dicebear.com/api/initials/:${nameEncoded}.svg`
         const result = await addDoc(collection(db, dataType), {
            ...data,
            photoUrl,
         })

         // Add history
         history.add({
            tenantId: result.id,
            dataType,
            recordId: result.id,
            actionId: 'add',
            data: {
               ...data,
               photoUrl,
            },
         })

         // Add to state
         const docRef = doc(db, dataType, result.id)
         const snap = await getDoc(docRef)
         store.commit(`${dataType}/set`, {
            id: snap.id,
            ...snap.data(),
         })

         Notify.create('Record added')
         router.push({ name: dataType, params: { id: result.id } })
      } catch (error) {
         console.error(`modules/${dataType}`, 'add', error.message)
         Notify.create({ type: 'negative', message: 'Add failed' })
      }
   }

   const update = async (data) => {
      try {
         const { id, ...rest } = data
         let docRef = doc(db, dataType, id)
         await updateDoc(docRef, rest)

         // Add history
         history.add({
            tenantId: data.id,
            dataType,
            recordId: data.id,
            actionId: 'update',
            data: rest,
         })

         docRef = doc(db, dataType, id)
         const snap = await getDoc(docRef)
         store.commit(`${dataType}/set`, {
            id: snap.id,
            ...snap.data(),
         })

         Notify.create('Record updated')
         router.push({
            name: dataType,
            params: { id },
         })
      } catch (error) {
         console.error(`modules/${dataType}`, 'update', error.message)
         Notify.create({ type: 'negative', message: 'Update failed' })
      }
   }

   const remove = async (id) => {
      try {
         const selectedId = id ? id : route.params.id
         const docRef = doc(db, dataType, selectedId)

         const snap = await getDoc(docRef)
         const data = snap.data()

         await deleteDoc(docRef)

         // Add history
         history.add({
            tenantId: id,
            dataType,
            recordId: id,
            actionId: 'delete',
            data,
         })

         store.commit(`${dataType}/remove`, selectedId)

         Notify.create('Record deleted')
         router.push({ name: dataType })
      } catch (error) {
         console.error(`modules/${dataType}`, 'remove', error.message)
         Notify.create({ type: 'negative', message: 'Delete failed' })
      }
   }

   const getFromHostPrefix = async (hostPrefix) => {
      return new Promise(async (res, rej) => {
         try {
            let collectionRef = collection(db, dataType)
            let queryRef = query(
               collectionRef,
               where('hostPrefix', '==', hostPrefix)
            )
            let snapshot = await getDocs(queryRef)

            if (snapshot.empty) {
               return res(false)
            }

            let response = {
               tenant: {
                  id: snapshot.docs[0].id,
                  ...snapshot.docs[0].data(),
               },
            }

            collectionRef = collection(
               db,
               dataType,
               response.tenant.id,
               'settings'
            )
            snapshot = await getDocs(collectionRef)

            response = {
               ...response,
               settings: snapshot.docs[0].data(),
            }
            res(response)
         } catch (error) {
            console.error(
               `modules/${dataType}`,
               'getFromHostPrefix',
               error.message
            )
            rej()
         }
      })
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
      getFromHostPrefix,
   }
}
