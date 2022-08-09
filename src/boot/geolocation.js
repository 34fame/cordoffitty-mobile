import { boot } from 'quasar/wrappers'
import { Platform } from 'quasar'
import { Geolocation } from '@capacitor/geolocation'

export default boot(async ({ store }) => {
   if (Platform.is.capacitor) {
      try {
         await Geolocation.watchPosition(async (position) => {
            const coords = {
               lat: position.coords.latitude,
               lng: position.coords.longitude,
            }
            store.dispatch('app/setCoords', coords)
         })
      } catch (error) {
         console.error('boot/geolocation', error.message)
      }
   }
})
