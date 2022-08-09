import {
   collection as _collection,
   collectionGroup as _collectionGroup,
   doc as _doc,
   getDoc as _getDoc,
   getDocs as _getDocs,
   addDoc as _addDoc,
   setDoc as _setDoc,
   updateDoc as _updateDoc,
   deleteDoc as _deleteDoc,
   query as _query,
   where as _where,
   orderBy as _orderBy,
   limit as _limit,
} from 'firebase/firestore'

import { db } from 'boot/firebase'

export const getDoc = async ({ tenantId, collection, id }) => {
   return new Promise(async (res, rej) => {
      try {
         const docRef =
            collection === 'tenants'
               ? _doc(db, 'tenants', tenantId)
               : _doc(db, 'tenants', tenantId, collection, id)
         const snapshot = await _getDoc(docRef)

         if (!snapshot.exists) {
            return res(null)
         }

         res({ id: snapshot.id, ...snapshot.data() })
      } catch (error) {
         console.error('useDb', 'getDoc', error.message)
         rej(error)
      }
   })
}

export const getDocs = async ({
   tenantId,
   collection,
   where = [],
   orderBy = [],
   limit,
}) => {
   return new Promise(async (res, rej) => {
      try {
         let docs = []
         const collectionRef =
            collection === 'tenants'
               ? _collection(db, 'tenants')
               : _collection(db, 'tenants', tenantId, collection)

         let queryArgs = [collectionRef]
         if (where.length) {
            where.forEach((w) => {
               queryArgs[queryArgs.length] = _where(w[0], w[1], w[2])
            })
         }

         if (orderBy.length) {
            orderBy.forEach((o) => {
               queryArgs[queryArgs.length] =
                  orderBy.length === 1 ? _orderBy(o[0]) : _orderBy(o[0], o[1])
            })
         }

         if (limit) {
            queryParts[queryParts.length] = _limit(limit)
         }

         const queryRef = _query(...queryArgs)

         const snapshot = await _getDocs(queryRef)
         snapshot.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() })
         })
         res(docs)
      } catch (error) {
         console.error('useDb', 'getDocs', error.message)
         rej(error)
      }
   })
}

export const addDoc = async ({ eventId, tenantId, dataType, data }) => {
   return new Promise(async (res, rej) => {
      const fn = 'useDb/addDoc'
      try {
         Logger.info(`> (${eventId}) Starting ${fn}...`)
         const startTime = new Date().valueOf()
         Logger.debug(`> (${eventId}) ${fn} tenantId ${tenantId}`)
         Logger.debug(`> (${eventId}) ${fn} dataType ${dataType}`)
         Logger.debug(
            `> (${eventId}) ${fn} data ${JSON.stringify(data, null, 2)}`
         )

         const id = ulid()
         const docRef =
            dataType === 'tenants'
               ? db.collection('tenants').doc(id)
               : db
                    .collection('tenants')
                    .doc(tenantId)
                    .collection(dataType)
                    .doc(id)
         await docRef.set(data)
         Logger.info(`> (${eventId}) ${fn} Added ${dataType} doc ${id}...`)

         Logger.info(`> (${eventId}) ${fn} Finished...`)
         const endTime = new Date().valueOf()
         Logger.info(`> (${eventId}) ${fn} took ${endTime - startTime}ms...`)

         res(id)
      } catch (error) {
         Logger.error(`!!!!`)
         Logger.error(`! (${eventId}) ${fn} ${error.message}`)
         Logger.error(`!!!!`)
         rej(error)
      }
   })
}

export const setDoc = async ({ eventId, tenantId, dataType, id, data }) => {
   return new Promise(async (res, rej) => {
      const fn = 'useDb/setDoc'
      try {
         Logger.info(`> (${eventId}) Starting ${fn}...`)
         const startTime = new Date().valueOf()
         Logger.debug(`> (${eventId}) ${fn} tenantId ${tenantId}`)
         Logger.debug(`> (${eventId}) ${fn} dataType ${dataType}`)
         Logger.debug(`> (${eventId}) ${fn} id ${id}`)
         Logger.debug(
            `> (${eventId}) ${fn} data ${JSON.stringify(data, null, 2)}`
         )

         const docRef =
            dataType === 'tenants'
               ? db.collection('tenants').doc(id)
               : db
                    .collection('tenants')
                    .doc(tenantId)
                    .collection(dataType)
                    .doc(id)
         await docRef.set(data)
         Logger.info(`> (${eventId}) ${fn} Set ${dataType} doc ${id}...`)

         Logger.info(`> (${eventId}) ${fn} Finished...`)
         const endTime = new Date().valueOf()
         Logger.info(`> (${eventId}) ${fn} took ${endTime - startTime}ms...`)

         res(id)
      } catch (error) {
         Logger.error(`!!!!`)
         Logger.error(`! (${eventId}) ${fn} ${error.message}`)
         Logger.error(`!!!!`)
         rej(error)
      }
   })
}

export const updateDoc = async ({ eventId, tenantId, dataType, id, data }) => {
   return new Promise(async (res, rej) => {
      const fn = 'useDb/updateDoc'
      try {
         Logger.info(`> (${eventId}) Starting ${fn}...`)
         const startTime = new Date().valueOf()
         Logger.debug(`> (${eventId}) ${fn} tenantId ${tenantId}`)
         Logger.debug(`> (${eventId}) ${fn} dataType ${dataType}`)
         Logger.debug(`> (${eventId}) ${fn} id ${id}`)
         Logger.debug(
            `> (${eventId}) ${fn} data ${JSON.stringify(data, null, 2)}`
         )

         const docRef =
            dataType === 'tenants'
               ? db.collection('tenants').doc(id)
               : db
                    .collection('tenants')
                    .doc(tenantId)
                    .collection(dataType)
                    .doc(id)
         await docRef.update(data)
         Logger.info(`> (${eventId}) ${fn} Set ${dataType} doc ${id}...`)

         Logger.info(`> (${eventId}) ${fn} Finished...`)
         const endTime = new Date().valueOf()
         Logger.info(`> (${eventId}) ${fn} took ${endTime - startTime}ms...`)

         res(id)
      } catch (error) {
         Logger.error(`!!!!`)
         Logger.error(`! (${eventId}) ${fn} ${error.message}`)
         Logger.error(`!!!!`)
         rej(error)
      }
   })
}

export const deleteDocs = async ({
   eventId,
   tenantId,
   dataType,
   where = [],
}) => {
   return new Promise(async (res, rej) => {
      const fn = 'useDb/deleteDocs'
      try {
         Logger.info(`> (${eventId}) Starting ${fn}...`)
         const startTime = new Date().valueOf()

         let docs = []

         const collectionRef =
            dataType === 'tenants'
               ? db.collection('tenants')
               : db.collection('tenants').doc(tenantId).collection(dataType)
         let queryRef = collectionRef
         if (where.length) {
            where.forEach((w) => {
               queryRef = queryRef.where(w[0], w[1], w[2])
            })
         }
         const snapshot = await queryRef.get()
         snapshot.forEach((doc) => {
            docs.push(doc.id)
         })
         Logger.info(`> (${eventId}) ${fn} Found ${docs.length} ${dataType}...`)

         // No docs to delete
         if (!docs.length) {
            Logger.info(`> (${eventId}) ${fn} Deleted 0 docs...`)

            Logger.info(`> (${eventId}) ${fn} Finished...`)
            const endTime = new Date().valueOf()
            Logger.info(`> (${eventId}) ${fn} took ${endTime - startTime}ms...`)
            return res()
         }

         // Perform batch deletes
         const batch = db.batch()
         docs.forEach((doc) => {
            batch.delete(collectionRef.doc(doc))
         })
         await batch.commit()
         Logger.info(`> (${eventId}) ${fn} Deleted ${docs.length} docs...`)

         Logger.info(`> (${eventId}) ${fn} Finished...`)
         const endTime = new Date().valueOf()
         Logger.info(`> (${eventId}) ${fn} took ${endTime - startTime}ms...`)

         res()
      } catch (error) {
         Logger.error(`!!!!`)
         Logger.error(`! (${eventId}) ${fn} ${error.message}`)
         Logger.error(`!!!!`)
         rej(error)
      }
   })
}
