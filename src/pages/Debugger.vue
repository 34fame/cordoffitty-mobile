<template>
   <q-page class="column q-gutter-y-lg text-primary" padding>
      <q-btn label="Operator" :to="{ name: 'operator' }" />
      <q-card bordered flat square style="width: 100%">
         <q-card-section>
            <q-virtual-scroll
               :items="debugLogs"
               separator
               v-slot="item"
               style="max-height: 80vh"
            >
               <q-item :key="item" dense>
                  <q-item-section>
                     <q-item-label>{{ item.item }}</q-item-label>
                  </q-item-section>
               </q-item>
            </q-virtual-scroll>
         </q-card-section>
      </q-card>
   </q-page>
</template>

<script>
import {
   defineComponent,
   computed,
   onBeforeUnmount,
   onMounted,
   ref,
   watch,
} from 'vue'
import { useStore } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

export default defineComponent({
   name: 'DebuggerPage',

   setup() {
      const store = useStore()

      // let interval = null

      const entries = ref([])

      const debugLogs = computed(() => cloneDeep(store.state.app.debugLogs))

      // onMounted(() => {
      //    interval = setInterval(() => {
      //       entries.value.push(new Date().toISOString())
      //    }, 1000)
      // })

      // onBeforeUnmount(() => {
      //    clearInterval(interval)
      // })

      return { debugLogs }
   },
})
</script>

<style lang="sass"></style>
