<template>
   <q-page class="flex flex-center">
      <div class="column q-gutter-y-lg">
         <section class="text-h4 text-secondary">Logging out...</section>
      </div>
   </q-page>
</template>

<script>
import { defineComponent, computed, inject, onMounted } from 'vue'
import { Loading } from 'quasar'
import { useStore } from 'vuex'

import useApp from 'src/modules/App'

export default defineComponent({
   name: 'LogoutPage',

   setup() {
      const auth = inject('auth')
      const axios = inject('axios')
      const store = useStore()
      const app = useApp()

      const loading = computed(() => store.state.app.loading)

      onMounted(async () => {
         try {
            Loading.show()
            store.commit('app/setLoading', true)
            await axios.post('/auth/logout')
            store.dispatch('app/clear')
            await app.unloadAll()
            await auth.signOut()
         } catch (error) {
            console.error('Logout', 'onMounted', error.message)
         } finally {
            store.commit('app/setLoading', false)
            Loading.hide()
         }
      })

      return { loading }
   },
})
</script>
