<template>
   <q-layout view="lHh Lpr lFf">
      <q-header bordered>
         <q-toolbar v-if="operator">
            <q-toolbar-title>{{ operator.name }}</q-toolbar-title>
            <q-btn
               color="secondary"
               text-color="white"
               icon="logout"
               dense
               round
               @click="clickEndSession"
            />
         </q-toolbar>
      </q-header>

      <q-page-container>
         <router-view />
      </q-page-container>
   </q-layout>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
   name: 'OperatorLayout',

   setup() {
      const store = useStore()
      const router = useRouter()

      const operatorId = computed(
         () => store.state.users.selected || store.state.app.user.id
      )
      const operator = computed(() =>
         store.getters['users/item'](operatorId.value)
      )

      return {
         operator,
         async clickEndSession() {
            // TODO Verify PIN
            // console.log('end session clicked', loggedInUser.value)
            // console.log('currentUser', await auth.getCurrentUser())
            // user.select('')
            // SessionStorage.clear()
            // console.log('role', loggedInUser.value.role === 'Operator')
            // if (loggedInUser.value.role === 'Operator') {
            //    console.log('go to logout')
            //    console.log(route.name)
            //    await router.push('/logout')
            //    console.log('we should not be here')
            //    console.log(route.name)
            // } else {
            //    router.push({ name: 'home' })
            // }
            router.push({ name: 'logout' })
         },
      }
   },
})
</script>
