<template>
   <q-card
      v-if="!loading"
      class="text-primary"
      bordered
      style="width: 95%; max-width: 400px"
   >
      <section>
         <GMapMap
            :center="{
               lat: markers[0].location.position.lat,
               lng: markers[0].location.position.lng,
            }"
            :zoom="13"
            mapType="terrain"
            :options="{
               zoomControl: true,
               mapTypeControl: false,
               scaleControl: false,
               streetViewControl: false,
               rotateControl: false,
               disableDefaultUi: true,
               fullscreenControl: true,
            }"
            ref="map"
            :tilt="0"
            style="width: 100%; height: 200px"
         >
            <GMapMarker
               v-for="marker in markers"
               :key="marker.id"
               :id="marker.id"
               :position="marker.location.drop || marker.location.position"
               :icon="marker.location.icon || ''"
            />
         </GMapMap>
      </section>

      <q-card-section>
         <q-btn
            fab
            color="accent"
            icon="place"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%)"
         />

         <template v-if="stop.stop.id === 'start' || stop.stop.id === 'end'">
            <div class="col text-h6 ellipsis">{{ stop.stop.label }}</div>

            <div class="col text-subtitle1 text-accent ellipsis">
               {{ stop.stop.location.name }}
            </div>
         </template>

         <template v-else-if="stop.stop.type && stop.stop.type === 'manual'">
            <div class="col text-h6 ellipsis">{{ stop.stop.label }}</div>

            <div class="col text-subtitle1 text-accent ellipsis">
               {{ stop.stop.location.name }}
            </div>
         </template>

         <template v-else>
            <div class="col text-h6 ellipsis">{{ stop.stop.org }}</div>

            <div class="col text-subtitle1 text-accent ellipsis">
               {{ stop.stop.project }}
            </div>
         </template>
      </q-card-section>

      <q-card-section class="q-pt-none">
         <template v-if="stop.stop.id === 'start' || stop.stop.id === 'end'">
            <div>
               <div class="text-caption text-weight-bold">Address</div>
               <div class="text-caption">{{ stop.stop.address }}</div>
            </div>
            <div v-if="stop.stop.notes">
               <div class="text-caption text-weight-bold">Notes</div>
               <div class="text-caption">{{ stop.stop.notes }}</div>
            </div>
         </template>

         <template v-else-if="stop.stop.type && stop.stop.type === 'manual'">
            <section class="q-my-sm column q-gutter-y-xs">
               <div>
                  <div class="text-caption text-weight-bold">Address</div>
                  <div class="text-caption">{{ stop.stop.address }}</div>
               </div>
               <div v-if="stop.stop.notes">
                  <div class="text-caption text-weight-bold">Notes</div>
                  <div class="text-caption">{{ stop.stop.notes }}</div>
               </div>
            </section>
         </template>

         <template v-else>
            <div v-if="stop.stop.name" class="text-subtitle2">
               {{ stop.stop.name }}
            </div>

            <section class="q-my-sm column q-gutter-y-xs">
               <div v-if="stop.stop.notes" class="text-caption">
                  <div class="text-caption text-weight-bold">Notes</div>
                  <div class="text-caption">{{ stop.stop.notes }}</div>
               </div>
               <div v-if="stop.task.service">
                  <div class="text-caption text-weight-bold">Service</div>
                  <div class="text-caption">{{ stop.task.service }}</div>
               </div>
               <div v-if="stop.stop.dateDue">
                  <div class="text-caption text-weight-bold">Due Date</div>
                  <div class="text-caption">{{ stop.stop.dateDue }}</div>
               </div>
               <div>
                  <div class="text-caption text-weight-bold">Address</div>
                  <div class="text-caption">{{ stop.stop.address }}</div>
               </div>
            </section>

            <section
               v-if="
                  stop.task.serviceObj &&
                  stop.task.serviceObj.type.toLowerCase() === 'asset'
               "
            >
               <section class="q-py-md row items-end q-gutter-x-sm">
                  <InputField
                     label="Asset*"
                     v-model="model.stop.assetNumber"
                     required
                  />
                  <q-btn
                     color="secondary"
                     dense
                     icon="qr_code"
                     style="height: 40px"
                  />
               </section>
               <q-separator />
            </section>
         </template>
      </q-card-section>

      <q-card-actions>
         <q-btn
            v-if="
               stop.task.serviceObj &&
               stop.task.serviceObj.type.toLowerCase() === 'asset'
            "
            color="secondary"
            :disable="!model.stop.assetNumber"
            icon="pin_drop"
            label="Mark"
            no-caps
         />
         <q-btn color="secondary" icon="add_a_photo" label="Photo" no-caps />
         <q-space />
         <q-btn
            color="secondary"
            :disable="
               stop.task.serviceObj &&
               stop.task.serviceObj.type.toLowerCase() === 'asset' &&
               !model.stop.assetNumber
            "
            icon="verified"
            label="Complete"
            no-caps
            @click="clickComplete"
         />
      </q-card-actions>
   </q-card>
</template>

<script>
import {
   defineComponent,
   defineAsyncComponent,
   computed,
   inject,
   ref,
   onMounted,
   watch,
} from 'vue'
import { useStore } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

export default defineComponent({
   name: 'TaskCard',

   props: {
      stop: {
         type: Object,
         required: true,
      },
   },

   components: {
      InputField: defineAsyncComponent(() =>
         import('components/forms/FormsInputField.vue')
      ),
   },

   emits: ['update'],

   setup(props, { emit }) {
      const logger = inject('logger')
      const store = useStore()

      const loading = ref(true)
      const model = ref(props.stop)

      // const assetNumber = computed(() => {
      //    if (!props.task) return ''
      //    const assetId = props.task.assetId
      //    if (!assetId) return ''
      //    const asset = store.getters['assets/item'](assetId)
      //    return asset.assetNumber
      // })
      const project = computed(() => {
         if (!props.stop) return ''
         return store.getters['projects/item'](props.stop.stop.projectId)
      })
      const markers = computed(() => {
         if (!props.stop) return []
         return [
            {
               ...props.stop.task,
               ...props.stop.stop,
               type: 'Work Order Drop',
               label: props.stop.task.name,
            },
         ]
      })

      onMounted(async () => {
         logger.info('TaskCard', 'onMounted', 'stop', props.stop)
         // let interval = setInterval(() => {
         // logger.info('Trying...')
         // if (props.stop) {
         // clearInterval(interval)
         // model.value = props.stop.stop
         loading.value = false
         // }
         // }, 500)
      })

      watch(
         () => model.value.stop.assetNumber,
         async () => {
            loading.value = true
            logger.info('TaskCard', 'watch', model.value)
            await emit('update', cloneDeep(model.value.stop))
            loading.value = false
         },
         { deep: true }
      )

      return {
         loading,
         markers,
         model,
         project,
         clickComplete: () => {
            // model.value.stop.status = 'Complete'
            emit('update', {
               ...model.value.stop,
               status: 'Complete',
            })
         },
      }
   },
})
</script>

<style lang="sass"></style>
