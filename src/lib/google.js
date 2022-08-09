import { axios } from 'boot/axios'

const key = process.env.GOOGLE_APIKEY

export default function useGoogle() {
   const getGeocode = async (address) => {
      let endpoint =
         'https://maps.googleapis.com/maps/api/geocode/json?address='
      endpoint += address
      endpoint += '&key=' + key
      let options = {
         headers: {
            Accept: 'application/json',
         },
      }

      let res = await axios.get(endpoint, options)
      if (res.data.results.length) {
         return res.data.results[0]
      } else {
         return null
      }
   }

   const place = async (address) => {
      address = encodeURIComponent(address)
      const geocode = await getGeocode(address)
      if (!geocode) return null

      const placeId = geocode.place_id
      let mapUrl = 'https://www.google.com/maps/embed/v1/place'
      mapUrl = mapUrl + '?q=place_id:' + placeId
      mapUrl = mapUrl + '&zoom=12'
      mapUrl = mapUrl + `&key=${key}`
      return mapUrl
   }

   const map = async (latitude, longitude) => {
      let mapUrl = 'https://www.google.com/maps/embed/v1/place'
      mapUrl = mapUrl + `?q={${latitude},${longitude}}`
      mapUrl = mapUrl + '&zoom=14'
      mapUrl = mapUrl + `&key=${key}`
      return mapUrl
   }

   return { getGeocode, place, map }
}
