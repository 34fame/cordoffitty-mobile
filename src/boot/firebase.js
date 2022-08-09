import { boot } from 'quasar/wrappers'
import { Notify, LocalStorage, SessionStorage, Platform } from 'quasar'
import LogRocket from 'logrocket'
import { initializeApp } from 'firebase/app'
import {
   getFirestore,
   connectFirestoreEmulator,
   initializeFirestore,
   getDoc,
   doc,
   updateDoc,
} from 'firebase/firestore'
import {
   connectAuthEmulator,
   onAuthStateChanged,
   initializeAuth,
   browserLocalPersistence,
   signInWithCustomToken,
   indexedDBLocalPersistence,
} from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

import { logger } from './logger'
import useUtils from 'src/lib/utils'

const useEmulator = process.env.APP_ENV === 'local'

const firebaseConfig = useEmulator
   ? {
        projectId: 'emulator-sandbox',
        authDomain: `emulator-sandbox.firebaseapp.com`,
        apiKey: 'emulator-sandbox-key',
        storageBucket: 'emulator-sandbox.appspot.com',
     }
   : {
        apiKey: process.env.FIREBASE_APIKEY,
        authDomain: process.env.FIREBASE_AUTHDOMAIN,
        projectId: process.env.FIREBASE_PROJECTID,
        storageBucket: process.env.FIREBASE_STORAGEBUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
        appId: process.env.FIREBASE_APPID,
        measurementId: process.env.FIREBASE_MEASUREMENTID,
     }

const firebaseApp = initializeApp(firebaseConfig)

let analytics
if (!useEmulator) {
   analytics = getAnalytics()
}
let auth
if (Platform.is.capacitor) {
   auth = initializeAuth(firebaseApp, {
      persistence: indexedDBLocalPersistence,
   })
} else {
   auth = initializeAuth(firebaseApp, {
      persistence: browserLocalPersistence,
   })
}
let db
if (useEmulator) {
   db = initializeFirestore(firebaseApp, {
      experimentalAutoDetectLongPolling: true,
   })
} else {
   db = getFirestore()
}
const storage = getStorage()

if (useEmulator) {
   // Must use local IP address with Capacitor/Cordova
   connectAuthEmulator(auth, 'http://192.168.0.200:9099')
   connectFirestoreEmulator(db, '192.168.0.200', 8081)
   connectStorageEmulator(storage, '192.168.0.200', 9199)
}

const updateUser = async (user) => {
   return new Promise(async (res, rej) => {
      const fn = 'updateUser'
      logger.info(`>>> ${fn} starting...`)
      try {
         // Update user with latest identity data and lastLogin
         const id = user.id
         delete user.id
         const docRef = doc(db, 'tenants', user.tenantId, 'users', id)
         const updates = {
            ...user,
            lastLogin: new Date().valueOf(),
         }
         await updateDoc(docRef, updates)
         logger.info(`--- ${fn} updated user in db`, id)
         logger.debug(`--- ${fn} user detail`, updates)

         // Load and return latest version of the user
         const snapshot = await getDoc(docRef)
         user = {
            id: snapshot.id,
            ...snapshot.data(),
         }
         res(user)
      } catch (error) {
         logger.error(`*** ${fn} ${error.message}`)
         rej()
      } finally {
         logger.info(`<<< ${fn} ending...`)
      }
   })
}

export default boot(async ({ app, router, store }) => {
   const utils = useUtils()

   const killSession = () => {
      const fn = 'killSession'
      logger.info(`>>> ${fn} starting...`)
      LocalStorage.clear()
      SessionStorage.clear()
      logger.info(`<<< ${fn} ending...`)
   }

   onAuthStateChanged(auth, async (authUser) => {
      const fn = 'onAuthStateChanged'
      logger.info(`>>> ${fn} starting...`)
      try {
         if (authUser) {
            logger.info(`--- ${fn} found authUser`, authUser.uid)
            logger.debug(`--- ${fn} authUser detail`, authUser)
            if (!authUser.stsTokenManager.accessToken) {
               logger.warn(
                  `--- ${fn} could not find access token for `,
                  authUser.uid
               )
               Notify.create({
                  type: 'negative',
                  message: 'Login failed',
               })
               killSession()
               logger.info(`<<< ${fn} ending...`)
               return router.push({ name: 'index' })
            }
            logger.debug(
               `--- ${fn} accessToken`,
               authUser.stsTokenManager.accessToken
            )
            const decoded = utils.decodeJwt(
               authUser.stsTokenManager.accessToken
            )
            logger.debug(`--- ${fn} decoded accessToken`, decoded)
            let user = {
               name: decoded.name,
               orgId: decoded.orgId,
               phone: decoded.phone || '',
               photoUrl: decoded.photoUrl || '',
               role: decoded.role,
               status: decoded.status,
               tenantId: decoded.tenantId,
               id: authUser.uid,
            }
            user = await updateUser({ ...user })

            if (process.env.APP_ENV === 'prod') {
               LogRocket.identify(user.id, {
                  name: user.name,
                  email: user.email || 'n/a',
                  tenant: `${store.getters['tenants/item'](user.tenantId)} (${
                     user.tenantId
                  })`,
                  orgId: `${store.getters['orgs/item'](user.orgId)} (${
                     user.orgId
                  })`,
                  role: user.role,
               })
            }

            store.commit('app/setUser', user)
            router.push({ name: 'home' })
         } else {
            logger.info(`--- ${fn} found unauthenticated session`)
            killSession()
            router.push({ name: 'index' })
         }
      } catch (error) {
         logger.error(`*** ${fn} ${error.message}`)
         Notify.create({ type: 'negative', message: 'Login failed' })
         router.push({ name: 'login' })
      } finally {
         logger.info(`<<< ${fn} ending...`)
      }
   })

   if (analytics) {
      app.provide('analytics', analytics)
   }
   app.provide('auth', auth)
   app.provide('signInWithCustomToken', signInWithCustomToken)
   app.provide('db', db)
})

export { auth, db }
