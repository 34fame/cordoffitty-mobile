<template>
   <q-page v-if="!loading" class="flex flex-center">
      <div class="column" style="width: 95%; max-width: 320px">
         <!-- Brand -->
         <div class="column justify-center items-center q-gutter-y-sm">
            <q-img :src="logo" height="128px" width="128px" />
            <span class="text-h4 text-primary text-center">{{
               brandName
            }}</span>
            <span class="text-h6 text-accent text-weight-light">
               {{ translate('loginTitle') }}
            </span>
         </div>

         <!-- Login Card -->
         <div class="q-mt-lg">
            <q-card class="q-pa-md">
               <q-card-section v-if="stage === 1">
                  <section class="column q-gutter-y-md">
                     <span class="text-accent">
                        {{ translate('loginNote') }}
                     </span>
                     <q-form class="q-gutter-md" @submit="requestPasscode">
                        <!-- <q-input label="Email" outlined v-model="email" /> -->
                        <InputField
                           dataCy="input-email"
                           autofocus
                           :label="translate('email', 'title')"
                           type="email"
                           v-model="email"
                        />
                        <section class="row q-gutter-x-md">
                           <q-btn
                              data-cy="btn-back"
                              color="secondary"
                              :disable="loading"
                              :label="translate('back', 'title')"
                              no-caps
                              outline
                              :to="{ name: 'index' }"
                           />
                           <q-btn
                              data-cy="btn-next"
                              color="secondary"
                              :label="translate('next', 'title')"
                              :loading="loading"
                              no-caps
                              :disable="loading || email.length < 6"
                              type="submit"
                           />
                        </section>
                     </q-form>
                  </section>
               </q-card-section>
               <q-card-section v-if="stage === 2">
                  <q-form class="q-gutter-md" @submit="loginWithPasscode">
                     <InputField
                        :label="translate('email', 'title')"
                        readonly
                        type="email"
                        v-model="email"
                     />
                     <InputField
                        autofocus
                        :label="translate('passcode', 'title')"
                        mask="####"
                        v-model="passcode"
                     />
                     <section class="column q-gutter-y-sm">
                        <q-btn
                           color="secondary"
                           :label="translate('login', 'title')"
                           :loading="loading"
                           no-caps
                           :disable="passcode.length !== 4"
                           type="submit"
                        />
                        <q-btn
                           color="secondary"
                           :label="translate('requestanotherpasscode', 'title')"
                           :loading="loading"
                           no-caps
                           outline
                           @click="requestPasscode"
                        />
                     </section>
                  </q-form>
               </q-card-section>
            </q-card>
         </div>

         <!-- Other Stuff -->
         <div class="q-mt-sm row justify-end text-grey-4">v{{ version }}</div>
      </div>
   </q-page>
</template>

<script>
import {
   defineComponent,
   defineAsyncComponent,
   computed,
   inject,
   onMounted,
   ref,
} from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { Notify, setCssVar } from 'quasar'

import packageInfo from '../../../package.json'
import useUtils from 'src/lib/utils'
import useTenant from 'src/modules/Tenants'

export default defineComponent({
   name: 'LoginPage',

   components: {
      InputField: defineAsyncComponent(() =>
         import('components/forms/FormsInputField.vue')
      ),
   },

   setup() {
      const auth = inject('auth')
      const signInWithCustomToken = inject('signInWithCustomToken')
      const axios = inject('axios')
      const store = useStore()
      const route = useRoute()
      const router = useRouter()
      const utils = useUtils()
      const tenant = useTenant()

      const stage = ref(1)
      const email = ref('')
      const passcode = ref('')
      const logo = ref(require('assets/cordoffitty-light.png'))
      const brandName = ref('Cordoffitty')

      const loading = computed(() => store.state.app.loading)

      onMounted(async () => {
         if (store.getters['app/loggedIn']) {
            router.push({ name: 'home' })
         }

         const host = window.location.host
         const hostTenant = host.split('.')[0]
         const tenantDoc = await tenant.getFromHostPrefix(hostTenant)
         if (!tenantDoc) return null

         // Apply brand colors
         if (!tenantDoc.settings.brandColors) return null
         const brandColors = tenantDoc.settings.brandColors
         setCssVar('primary', brandColors.primary)
         setCssVar('secondary', brandColors.secondary)
         setCssVar('accent', brandColors.accent)
         setCssVar('dark', brandColors.dark)

         // Apply logo
         if (tenantDoc.settings.logo && tenantDoc.settings.logo.url) {
            logo.value = tenantDoc.settings.logo.url
         }

         // Apply brand name
         if (tenantDoc.settings.useCompanyName === true) {
            brandName.value = tenantDoc.tenant.name
         }
      })

      return {
         version: packageInfo.version,
         loading,
         logo,
         brandName,
         stage,
         email,
         passcode,
         async requestPasscode() {
            try {
               store.commit('app/setLoading', true)

               const result = await axios.post('/auth/generate-passcode', {
                  email: email.value.toLowerCase(),
                  env: process.env.APP_ENV,
               })
               if (result.status === 200) {
                  /**
                   * This code overrides the normal authentication
                   * method in order to accommodate E2E testing.  It
                   * only works when client is in local mode and when
                   * specific users are used.
                   */
                  if (
                     (email.value.includes('acme.local') ||
                        email.value.includes('morelands.net') ||
                        email.value.includes('34fame.com')) &&
                     process.env.APP_ENV === 'local' &&
                     result.data.token
                  ) {
                     await signInWithCustomToken(auth, result.data.token)
                     store.commit('app/setLoading', false)
                     return
                  }
                  /* End Testing */

                  stage.value = 2
               } else {
                  Notify.create({
                     type: 'negative',
                     message: 'Unable to generate a passcode.',
                  })
               }
            } catch (error) {
               Notify.create({
                  type: 'negative',
                  message: 'Unable to generate a passcode.',
               })
               console.error('requestPasscode', error.message)
            } finally {
               store.commit('app/setLoading', false)
            }
         },
         async loginWithPasscode() {
            try {
               store.commit('app/setLoading', true)

               const result = await axios.post('/auth/login-with-passcode', {
                  email: email.value.toLowerCase(),
                  passcode: passcode.value,
               })
               if (result.status === 200) {
                  // const user = result.data.user
                  const token = result.data.token
                  const credential = await signInWithCustomToken(auth, token)
                  // const idToken = await auth.currentUser.getIdTokenResult()
               } else {
                  Notify.create({
                     type: 'negative',
                     message: 'Invalid passcode',
                  })
                  passcode.value = ''
               }
            } catch (error) {
               Notify.create({
                  type: 'negative',
                  message: 'Invalid passcode',
               })
               console.error('Login', 'loginWithPasscode', error.message)
            } finally {
               store.commit('app/setLoading', false)
            }
         },
         translate(key, toCase) {
            const translation = utils.translate({ key, toCase })
            return translation
         },
      }
   },
})
</script>
