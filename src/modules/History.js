import {
   collection,
   collectionGroup,
   doc,
   getDoc,
   getDocs,
   addDoc,
   query,
   where,
   orderBy,
   limit,
   startAfter,
} from 'firebase/firestore'
import { useStore } from 'vuex'

import { db } from 'boot/firebase'

const getUserName = async (tenantId, userId) => {
   try {
      const snap = await getDoc(doc(db, 'tenants', tenantId, 'users', userId))
      const data = snap.data()
      return data.name
   } catch (error) {
      console.error('modules/History', 'getUserName', error.message)
      return ''
   }
}

export default function useHistory() {
   const store = useStore()

   const load = async ({ dataType, recordId, last = null }) => {
      return new Promise(async (res) => {
         try {
            const limitCount = 25
            const tenantId =
               store.state.tenants.selected || store.state.app.user.tenantId

            const collectionRef = collection(db, 'tenants', tenantId, 'history')
            let queryRef
            if (last) {
               queryRef = query(
                  collectionRef,
                  where('collection', '==', dataType),
                  where('collectionId', '==', recordId),
                  orderBy('timestamp', 'desc'),
                  startAfter(last),
                  limit(limitCount)
               )
            } else {
               queryRef = query(
                  collectionRef,
                  where('collection', '==', dataType),
                  where('collectionId', '==', recordId),
                  orderBy('timestamp', 'desc'),
                  limit(limitCount)
               )
            }
            let snap = await getDocs(queryRef)
            let docs = []
            snap.forEach(async (doc) => {
               const data = doc.data()
               docs.push({
                  id: doc.id,
                  ...data,
               })
            })
            Promise.all(
               docs.map(async (doc) => {
                  doc.actor = await getUserName(doc.actorTenantId, doc.actorId)
               })
            )

            let response = {
               docs,
               last: null,
            }
            if (snap.docs.length === limitCount) {
               response.last = snap.docs[snap.docs.length - 1]
            }
            res(response)
         } catch (error) {
            console.error('modules/common', 'load', error.message)
            rej()
         }
      })
   }

   const add = async ({ tenantId, dataType, recordId, actionId, data }) => {
      try {
         await addDoc(collection(db, 'tenants', tenantId, 'history'), {
            tenantId,
            collection: dataType,
            collectionId: recordId,
            timestamp: new Date().valueOf(),
            actorId: store.state.app.user.id,
            actorTenantId: store.state.app.user.tenantId,
            actionId,
            data,
         })
      } catch (error) {
         console.error('modules/History', 'add', error.message)
      }
   }

   return { load, add }
}
