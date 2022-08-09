<template>
   <q-page class="flex flex-center">
      <div class="column q-gutter-y-lg">
         <section
            class="column items-center q-gutter-y-sm text-h4 text-secondary"
         >
            <span class="text-accent text-h6">Welcome to</span>
            <span>Cordoffitty</span>
            <!-- <span class="text-accent text-caption">by Cordoffity</span> -->
         </section>

         <section class="column q-gutter-y-lg">
            <q-btn
               color="secondary"
               no-caps
               :to="{ name: 'login' }"
               style="height: 64px"
            >
               <div class="row items-center q-gutter-x-md">
                  <q-icon name="fas fa-rocket" />
                  <span class="text-h5">Launch!</span>
               </div>
            </q-btn>
         </section>
      </div>
   </q-page>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
   name: 'IndexPage',

   setup() {
      const store = useStore()

      const loggedIn = computed(() => store.getters['app/loggedIn'])
      const user = computed(() => store.state.app.user)

      return { loggedIn, user }
   },
})
</script>
