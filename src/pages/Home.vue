<template>
   <q-page class="flex flex-center">
      <div class="column q-gutter-y-xl">
         <q-form
            v-if="!loading"
            class="q-gutter-md"
            @submit.prevent="clickStart"
         >
            <SelectField
               v-if="!loading"
               label="Select Operator"
               :options="userOptions"
               required
               v-model="selectedUser"
               style="width: 300px"
            />

            <InputField
               label="Lock PIN"
               mask="####"
               required
               :rules="[
                  (value) => value.length === 4 || 'PIN must be 4 digits',
               ]"
               v-model="pin"
            />

            <div class="column">
               <q-btn
                  color="secondary"
                  label="Start Operator Session"
                  no-caps
                  type="submit"
               />
            </div>
         </q-form>

         <q-btn
            color="accent"
            label="Logoff"
            no-caps
            :to="{ name: 'logout' }"
         />
      </div>
   </q-page>
</template>

<script>
import {
   defineComponent,
   computed,
   inject,
   onMounted,
   ref,
   defineAsyncComponent,
} from 'vue'
import { SessionStorage } from 'quasar'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import useApp from 'src/modules/App'
import useUser from 'src/modules/Users'

export default defineComponent({
   name: 'HomePage',

   components: {
      InputField: defineAsyncComponent(() =>
         import('components/forms/FormsInputField.vue')
      ),
      SelectField: defineAsyncComponent(() =>
         import('components/forms/FormsSelectField.vue')
      ),
   },

   setup() {
      const logger = inject('logger')

      const store = useStore()
      const router = useRouter()
      const app = useApp()
      const user = useUser()

      const selectedUser = ref('')
      const pin = ref('')

      const loading = computed(() => store.state.app.loading)
      const loggedInUser = computed(() => store.state.app.user)
      const loggedInUserIsOperator = computed(
         () => loggedInUser.value.role === 'Operator'
      )
      const userOptions = computed(() =>
         store.getters['users/options']({
            tenantId: loggedInUser.value.tenantId,
            orgId: loggedInUser.value.orgId,
            statusFilter: ['Active'],
            roleFilter: ['Operator'],
         })
      )

      onMounted(() => {
         logger.info('home', 'onMounted')
         // console.log('home', 'onMounted')
         // loading.value = true
         // await app.loadAll({})

         // if (SessionStorage.has('session')) {
         startOperatorSession()
         // }

         // if (loggedInUserIsOperator.value) {
         //    startOperatorSession()
         // }

         // loading.value = false
      })

      const startOperatorSession = () => {
         try {
            logger.info(
               'startOperatorSession',
               'session',
               SessionStorage.has('session')
            )
            if (SessionStorage.has('session')) {
               logger.info('startOperatorSession', 'has session')
               const session = SessionStorage.getItem('session')
               user.select(session.operator)
            } else if (loggedInUserIsOperator.value) {
               const userId = store.state.app.user.id
               logger.info('startOperatorSession', 'is operator', userId)
               user.select(userId)
               SessionStorage.set('session', {
                  operator: userId,
                  pin: null,
               })
            } else {
               logger.info('startOperatorSession', 'else')
               user.select(selectedUser.value)
               SessionStorage.set('session', {
                  operator: selectedUser.value,
                  pin: pin.value,
               })
            }
            logger.info(
               'startOperatorSession',
               'session',
               JSON.stringify(SessionStorage.getItem('session'))
            )
            // router.push({ name: 'operator' })
            router.push({ name: 'debugger' })
         } catch (error) {
            logger.error('Home', 'startOperatorSession', error.message)
         }
      }

      return {
         loading,
         selectedUser,
         pin,
         userOptions,
         clickStart() {
            startOperatorSession()
         },
      }
   },
})
</script>
