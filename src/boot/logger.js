import { boot } from 'quasar/wrappers'
import { createLogger, StringifyAndParseObjectsHook } from 'vue-logger-plugin'

import { store } from 'src/store'

// Custom hook (example)
const ServerLogHook = {
   run(event) {
      // Normally be a database or web service call here
      // console.log('Write log to server', {
      //    severity: event.level,
      //    data: event,
      //    timestamp: new Date().valueOf(),
      // })

      store.commit('app/addDebugLog', event.argumentArray.join(' '))
   },
}

const logger = createLogger({
   enabled: true,
   level: process.env.APP_ENV === 'prod' ? 'warn' : 'debug',
   callerInfo: true,
   prefixFormat: ({ level, caller }) => {
      let prefix = `[${level.toUpperCase()}]`

      if (caller) {
         let filename = caller.fileName
         filename = filename.split('.')
         filename = filename[0]
         prefix += ` [${filename}]`
      }

      return prefix
   },
   beforeHooks: [StringifyAndParseObjectsHook],
   afterHooks: [ServerLogHook],
})

export default boot(({ app }) => {
   app.provide('logger', logger)
   /**
    * Usage:
    *    const logger = inject("logger");
    *    logger.info('Hello, World!')
    * OR
    *    import { useLogger } from 'vue-logger-plugin'
    *
    *    setup() {
    *       const log = useLogger()
    *       log.info('Howdy')
    *    }
    *
    * Override out log level:
    *    logger.apply({ level: 'error' })
    *
    * Levels (in order): log, error, warn, info, debug
    *
    * https://www.npmjs.com/package/vue-logger-plugin
    */
})

export { logger }
