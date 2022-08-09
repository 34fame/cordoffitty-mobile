import { boot } from 'quasar/wrappers'
import VueGoogleMaps from '@fawmi/vue-google-maps'

export default boot(({ app }) => {
   app.use(VueGoogleMaps, {
      load: {
         key: process.env.GOOGLE_APIKEY,
         libraries: 'places',
      },
   })
})
