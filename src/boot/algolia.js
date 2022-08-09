import { boot } from 'quasar/wrappers'
import algoliasearch from 'algoliasearch/lite'

export default boot(({ app }) => {
   const client = algoliasearch(
      process.env.ALGOLIA_APPID,
      process.env.ALGOLIA_APIKEY
   )
   const index = client.initIndex(process.env.ALGOLIA_INDEX)
   app.provide('algolia', index)
})
