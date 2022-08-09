<template>
   <q-page class="column q-gutter-y-lg text-primary" padding>
      <q-btn label="Debugger" :to="{ name: 'debugger' }" />
      <section v-if="stops.length" class="column items-center q-gutter-y-md">
         <TaskCard
            v-for="stop in stops"
            :key="`${stop.dispatchId}_${stop.stop.id}`"
            :stop="stop"
            @update="
               (changes) => onUpdate(stop.dispatchId, stop.stop.id, changes)
            "
         />
      </section>

      <!-- <section class="q-mt-lg column q-gutter-y-xs">
         <span>Debug Info</span>
         <span>Operator: {{ operator }}</span>
         <span>Tenants: {{ tenants }}</span>
         <span>Orgs: {{ orgs }}</span>
         <span>Tasks: {{ tasks.length }}</span>
         <span>Task: {{ tasks[0] }}</span>
      </section> -->
   </q-page>
</template>

<script>
import {
   defineComponent,
   defineAsyncComponent,
   computed,
   inject,
   onMounted,
} from 'vue'
import { useStore } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

import useUtils from 'src/lib/utils'
import useCommon from 'src/modules/common'

export default defineComponent({
   name: 'OperatorPage',

   components: {
      TaskCard: defineAsyncComponent(() => import('components/TaskCard.vue')),
   },

   setup() {
      const logger = inject('logger')
      const store = useStore()
      const common = useCommon()
      const utils = useUtils()

      const operator = computed(
         () => store.state.users.selected || store.state.app.user.id
      )
      const stops = computed(() => {
         logger.info('dispatch', store.getters['dispatch/sorted']({}))
         let todayTasks = cloneDeep(
            store.getters['dispatch/sorted']({
               between: {
                  field: 'timestamp',
                  start: utils.startOfDay(),
                  end: utils.endOfDay(),
               },
            })
         )
         logger.info('todayTasks-before', todayTasks)
         logger.info('operator', operator.value)
         todayTasks = todayTasks.filter((f) => f.operatorId === operator.value)
         logger.info('todayTasks-after', todayTasks)
         let todayStops = []
         for (const task of todayTasks) {
            for (const stop of task.stops) {
               if (stop.status && stop.status.toLowerCase() === 'complete')
                  continue
               todayStops.push({
                  task,
                  stop,
                  dispatchId: task.id,
                  dateDue: stop.dateDue
                     ? utils.readableDate({
                          timestamp: task.dateDue,
                          format: 'MMMM D, YYYY',
                       })
                     : null,
               })
            }
         }
         logger.info('Operator', 'todayStops', todayStops)
         return todayStops
      })

      onMounted(() => {
         console.log('Operator', 'onMounted')
      })

      return {
         stops,

         async onUpdate(dispatchId, stopId, changes) {
            logger.info('Operator', 'onUpdate', dispatchId, stopId, changes)
            let dispatch = cloneDeep(store.getters['dispatch/item'](dispatchId))
            logger.info('Operator', 'onUpdate', 'dispatch', dispatch)
            let stops = dispatch.stops
            logger.info('Operator', 'onUpdate', 'stops', stops)
            const stopIndex = stops.findIndex((f) => f.id === stopId)
            logger.info('Operator', 'onUpdate', 'stopIndex', stopIndex)
            stops.splice(stopIndex, 1, changes)
            logger.info('Operator', 'onUpdate', 'stops', stops)
            dispatch.stops = stops
            logger.info('Operator', 'onUpdate', 'dispatch', dispatch)
            common.update('dispatch', { id: dispatchId, stops: dispatch.stops })
         },
      }
   },
})
</script>

<style lang="sass"></style>
