import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

import { doc, getDoc } from 'firebase/firestore'
import { db } from 'boot/firebase'

const getTranslations = async () => {
   return new Promise(async (res, rej) => {
      try {
         // Pull from DB
         const docRef = doc(db, 'i18n', 'mgHHhmPQdGurqT1tBxu6')
         const snapshot = await getDoc(docRef)
         const dbTranslations = snapshot.data()
         console.log('dbTranslations', dbTranslations)

         // Re-structure for i18n library
         let i18nTranslations = {
            en: {},
            es: {},
         }
         for (let key in dbTranslations.translations) {
            i18nTranslations.en[key] = dbTranslations.translations[key].en
            i18nTranslations.es[key] = dbTranslations.translations[key].es
         }

         // Return results
         console.log('i18nTranslations', i18nTranslations)
         res(i18nTranslations)
      } catch (error) {
         rej(error)
      }
   })
}

const i18n = createI18n({
   locale: 'en',
   fallbackLocale: 'en',
   messages,
})

export default boot(async ({ app }) => {
   // MAYBE when moving to database, add routine to create an "en" file
   // and use as fallback in case database isn't returning values

   // const messages = await getTranslations()

   // i18n.global.setLocaleMessage('en', messages.en)
   // i18n.global.setLocaleMessage('es', messages.es)

   app.use(i18n)
})

export { i18n }
