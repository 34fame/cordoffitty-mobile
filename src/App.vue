<template>
   <router-view />
</template>
<script>
import { defineComponent, computed, inject, onMounted, ref, watch } from 'vue'
import { Loading, Notify, setCssVar } from 'quasar'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import useApp from 'src/modules/App'
import useUser from 'src/modules/Users'

export default defineComponent({
   name: 'App',

   setup() {
      const auth = inject('auth')
      const logger = inject('logger')
      const { locale } = useI18n({ useScope: 'global' })
      const router = useRouter()
      const store = useStore()
      const app = useApp()

      const loading = computed(() => store.state.app.loading)
      const loggedIn = computed(() => store.getters['app/loggedIn'])
      const activeTenant = computed(() => store.state.app.user.tenantId)

      const bootstrapSession = async () => {
         logger.info('App', 'bootstrapSession')
         const interval = setInterval(async () => {
            try {
               logger.info(
                  'App',
                  'bootstrapSession',
                  loggedIn.value,
                  auth.currentUser,
                  activeTenant.value
               )
               if (!loggedIn.value) {
                  clearInterval(interval)
                  return
               }
               if (auth.currentUser && activeTenant.value) {
                  clearInterval(interval)
                  await app.loadAll({})

                  locale.value =
                     store.state.app.user.preferences?.language || 'en'

                  const settingsInterval = setInterval(() => {
                     if (store.getters['settings/all']) {
                        if (store.getters['settings/all'].brandColors) {
                           clearInterval(settingsInterval)
                           const brandColors =
                              store.getters['settings/all'].brandColors
                           setCssVar('primary', brandColors.primary)
                           setCssVar('secondary', brandColors.secondary)
                           setCssVar('accent', brandColors.accent)
                           setCssVar('dark', brandColors.dark)
                        }
                     }
                  }, 300)
               }
            } catch (error) {
               Notify.create({
                  type: 'negative',
                  message: `An error has occurred: ${error.message}`,
               })
               logger.error('App', 'onMounted', error.message)
               Loading.hide()
               loading.value = false
               clearInterval(interval)
               router.push({ name: 'logout' })
            }
         }, 500)
      }

      onMounted(async () => {
         logger.info('App', 'onMounted')
         store.commit('app/setLoading', true)
         logger.info('App', 'onMounted', 'loggedIn', loggedIn.value)
         await bootstrapSession()
         store.commit('app/setLoading', false)
         logger.info('App', 'onMounted', 'done')
      })

      watch(
         () => loggedIn.value,
         async () => {
            await bootstrapSession()
         }
      )

      watch(
         () => loading.value,
         () => {
            if (loading.value) {
               Loading.show()
            } else {
               Loading.hide()
            }
         }
      )

      return { loading }
   },
})
</script>

<style lang="sass">
body
   background-color: $grey-2
</style>
