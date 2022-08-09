import { boot } from 'quasar/wrappers'
import { Platform } from 'quasar'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'
import packageInfo from '../../../package.json'

export default boot(({ app, store }) => {
   const env = process.env.APP_ENV
   if (env === 'prod') {
      Bugsnag.start({
         apiKey: process.env.BUGSNAG_APIKEY,
         appVersion: `${packageInfo.version}`,
         appType: Platform.is.capacitor ? 'mobile' : 'web',
         plugins: [new BugsnagPluginVue()],
         onError: function (event) {
            const user = store.state.app.user
            if (user) {
               const tenant = store.state.tenants.items[user.tenantId]
               const org = store.state.orgs.items[user.orgId]
               event.addMetadata('tenant', {
                  id: user.tenantId,
                  name: tenant.name,
               })
               event.addMetadata('org', {
                  id: user.orgId,
                  name: org.name,
                  type: org.type,
               })
               event.addMetadata('user', {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  title: user.title,
                  role: user.role,
                  status: user.status,
                  tenantId: user.tenantId,
               })
               event.setUser(user.id, user.email, user.name)
            }
         },
      })

      const bugsnagVue = Bugsnag.getPlugin('vue')
      app.use(bugsnagVue)
   }
})
