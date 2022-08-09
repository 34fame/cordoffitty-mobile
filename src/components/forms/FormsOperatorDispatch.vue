<template>
   <q-card class="text-primary" bordered flat style="width: 300px">
      <!-- Driver (& truck assignment) -->
      <q-card-section class="column q-gutter-y-xs">
         <q-item class="q-pa-none">
            <q-item-section>
               <section class="column q-gutter-y-xs">
                  <span class="text-subtitle1 text-weight-bold">
                     {{ opDispatch.operatorName }}
                  </span>
                  <span class="text-caption">
                     {{ opDispatch.operatorOrg }}
                  </span>
               </section>
            </q-item-section>
            <q-item-section side>
               <div class="row q-gutter-x-xs">
                  <q-btn color="secondary" flat round icon="more_vert">
                     <q-menu>
                        <q-list>
                           <q-item-label header>Actions</q-item-label>
                           <q-item
                              clickable
                              v-close-popup
                              v-ripple
                              @click="clickAddStop"
                           >
                              <q-item-section side>
                                 <q-icon name="place" />
                              </q-item-section>
                              <q-item-section>
                                 <q-item-label>Add a Stop</q-item-label>
                              </q-item-section>
                           </q-item>

                           <q-item clickable v-close-popup v-ripple>
                              <q-item-section side>
                                 <q-icon name="highlight_off" />
                              </q-item-section>
                              <q-item-section>
                                 <q-item-label>Reset All</q-item-label>
                              </q-item-section>
                           </q-item>

                           <q-item-label header>Send to Driver</q-item-label>
                           <q-item
                              clickable
                              v-close-popup
                              v-ripple
                              @click="sendDispatch('sms')"
                           >
                              <q-item-section side>
                                 <q-icon name="sms" />
                              </q-item-section>
                              <q-item-section>
                                 <q-item-label>Send via SMS</q-item-label>
                              </q-item-section>
                           </q-item>
                           <q-item
                              clickable
                              v-close-popup
                              v-ripple
                              @click="sendDispatch('email')"
                           >
                              <q-item-section side>
                                 <q-icon name="forward_to_inbox" />
                              </q-item-section>
                              <q-item-section>
                                 <q-item-label>Send via Email</q-item-label>
                              </q-item-section>
                           </q-item>
                        </q-list>
                     </q-menu>
                  </q-btn>
               </div>
            </q-item-section>
         </q-item>
      </q-card-section>

      <!-- Stops -->
      <q-card-section class="q-pa-none">
         <q-card class="q-pa-none drop-target" bordered flat square>
            <q-list separator :id="model.operatorId">
               <q-item
                  v-for="(stop, stopIdx) in model.stops"
                  :key="stop.id"
                  :class="
                     stop.id !== 'start' && stop.id !== 'end' ? 'draggable' : ''
                  "
                  class="q-pa-none"
               >
                  <q-item-section>
                     <q-expansion-item
                        expand-icon="arrow_drop_down"
                        expanded-icon="arrow_drop_up"
                        header-class="bg-grey-1"
                     >
                        <!-- Stop Header -->
                        <template v-slot:header>
                           <q-item-section class="column q-gutter-y-xs">
                              <span class="text-body2 text-weight-bold">
                                 {{ stop.label }}
                              </span>
                              <span v-if="stop.service" class="text-caption">
                                 {{ stop.service }}
                              </span>
                              <span v-else class="text-caption">
                                 {{ stop.location.name }}
                              </span>
                           </q-item-section>
                           <q-item-section side>
                              <span
                                 v-if="stop.endTime"
                                 class="text-caption text-grey-5"
                              >
                                 {{ stop.endTime }}
                              </span>
                           </q-item-section>
                           <q-item-section side>
                              <q-icon
                                 :name="getStopIcon(stop).name"
                                 :color="getStopIcon(stop).color"
                                 size="24px"
                              />
                           </q-item-section>
                        </template>

                        <!-- Stop Details -->
                        <section class="q-pa-md">
                           <!-- Start -->
                           <template v-if="stop.id === 'start'">
                              <div class="column q-gutter-y-md">
                                 <SelectField
                                    label="Truck Assignment"
                                    :options="truckOptions"
                                    v-model="model.stops[stopIdx].truckId"
                                 />
                                 <AddressField
                                    label="Starting Address"
                                    v-model="model.stops[stopIdx].address"
                                    @update="
                                       (location) =>
                                          updateAddress('start', location)
                                    "
                                 />
                              </div>
                           </template>

                           <!-- End -->
                           <template v-else-if="stop.id === 'end'">
                              <div class="column q-gutter-y-md">
                                 <SelectField
                                    label="Truck Assignment"
                                    :options="truckOptions"
                                    v-model="model.stops[stopIdx].truckId"
                                 />
                                 <AddressField
                                    label="Ending Address"
                                    v-model="model.stops[stopIdx].address"
                                    @update="
                                       (location) =>
                                          updateAddress('end', location)
                                    "
                                 />
                              </div>
                           </template>

                           <!-- Other Stops -->
                           <template v-else>
                              <q-item-section class="column q-gutter-y-sm">
                                 <section class="column q-gutter-y-xs">
                                    <span>Address</span>
                                    <span class="text-weight-bold">
                                       {{ stop.address }}
                                    </span>
                                 </section>
                                 <section
                                    v-if="stop.service"
                                    class="column q-gutter-y-xs"
                                 >
                                    <span>Service</span>
                                    <span class="text-weight-bold">
                                       {{ stop.service }}
                                    </span>
                                 </section>
                                 <section
                                    v-if="!stop.type || stop.type !== 'manual'"
                                 >
                                    <SelectField
                                       label="Asset Assignment"
                                       :options="assetOptions"
                                       clearable
                                       v-model="model.stops[stopIdx].assetId"
                                    />
                                 </section>
                                 <section
                                    v-if="stop.notes"
                                    class="column q-gutter-y-xs"
                                 >
                                    <span>Notes</span>
                                    <span class="text-weight-bold">
                                       {{ stop.notes }}
                                    </span>
                                 </section>
                                 <q-separator inset />
                                 <section
                                    v-if="stop.org"
                                    class="column q-gutter-y-xs"
                                 >
                                    <span>Customer</span>
                                    <span class="text-weight-bold">
                                       {{ stop.org }}
                                    </span>
                                 </section>
                                 <section
                                    v-if="stop.project"
                                    class="column q-gutter-y-xs"
                                 >
                                    <span>Project</span>
                                    <span class="text-weight-bold">
                                       {{ stop.project }}
                                    </span>
                                 </section>
                              </q-item-section>
                           </template>
                        </section>
                     </q-expansion-item>
                  </q-item-section>
               </q-item>
            </q-list>
         </q-card>
      </q-card-section>

      <!-- Map -->
      <q-card-section
         v-if="markers.length"
         class="q-pa-none"
         style="width: 100%"
      >
         <GMapMap
            :center="{
               lat: markers[0].location.position.lat,
               lng: markers[0].location.position.lng,
            }"
            :zoom="9"
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
               :clickable="true"
               :draggable="marker.draggable"
               @click="clickMarker(marker)"
               @dragend="(e) => dragMarker(e)"
            />
         </GMapMap>
      </q-card-section>

      <!-- Summary -->
      <q-card-section class="bg-grey-1">
         <section class="column q-gutter-y-sm">
            <span class="text-caption">
               Estimated distance: {{ totalDistance }} miles
            </span>
            <span class="text-caption">
               Estimated drive time: {{ totalDuration }} minutes
            </span>
         </section>
      </q-card-section>
   </q-card>

   <!-- Add Stop Dialog -->
   <DialogDispatchStop
      v-if="showAddStop"
      @close="showAddStop = false"
      @update="(stop) => saveAddStop(stop)"
   />
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
import { Notify } from 'quasar'
import { useStore } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import { ulid } from 'ulid'

import useUtils from 'src/lib/utils'
import useOrders from 'src/modules/Orders'
import useDispatch from 'src/modules/Dispatch'

export default defineComponent({
   name: 'FormsOperatorDispatch',

   components: {
      AddressField: defineAsyncComponent(() =>
         import('components/forms/FormsAddressField.vue')
      ),
      SelectField: defineAsyncComponent(() =>
         import('components/forms/FormsSelectField.vue')
      ),
      DialogDispatchStop: defineAsyncComponent(() =>
         import('components/dialogs/DialogsDispatchStop.vue')
      ),
   },

   emits: ['mounted', 'update'],

   props: {
      opDispatch: {
         type: Object,
         required: true,
      },
   },

   setup(props, { emit }) {
      const axios = inject('axios')
      const logger = inject('logger')
      const store = useStore()
      const dispatch = useDispatch()
      const order = useOrders()
      const utils = useUtils()

      let directionsService, directionsRenderer

      const showAddStop = ref(false)
      const model = ref({ ...props.opDispatch })
      const totalDistance = ref(0)
      const totalDuration = ref(0)
      const markers = ref([])
      const map = ref(null)

      const selectedTenant = computed(() =>
         utils.globals().selectedId('tenants')
      )
      const truckOptions = computed(() => {
         let assets = store.getters['assets/options']({
            tenantId: selectedTenant.value,
         })
         assets = assets.filter((f) => f.label.toLowerCase().includes('truck'))
         assets = assets.map((item) => {
            let label = item.item.name
            if (item.item.assetNumber) {
               label += ` (${item.item.assetNumber})`
            }
            label += ` [${item.item.status}]`
            return {
               ...item,
               label,
            }
         })
         return assets
      })
      const assetOptions = computed(() => {
         let arr = store.getters['assets/options']({
            tenantId: selectedTenant.value,
         })
         // TODO should be handled in getter
         arr = arr.map((item) => {
            let label = item.item.name
            if (item.item.assetNumber) {
               label += ` (${item.item.assetNumber})`
            }
            label += ` [${item.item.status}]`
            return {
               ...item,
               label,
            }
         })
         // if (props.formModel.serviceId?.length) {
         //    const service =
         //       store.state.services.items[props.formModel.serviceId]
         //    arr = arr.filter((f) => f.item.name === service.category)
         // }
         return arr
      })

      const setRoutes = async () => {
         try {
            const process = `setRoutes-${props.opDispatch.operatorId.substr(
               props.opDispatch.operatorId.length - 5
            )}`

            totalDistance.value = 0
            totalDuration.value = 0

            if (!map.value) {
               return
            }

            logger.info(process, 'operator', props.opDispatch.operatorId)

            const _map = await map.value.$mapPromise
            // logger.info(process, '_map', _map)

            directionsRenderer.setMap(_map)

            const stops = cloneDeep(model.value.stops)
            logger.info(process, 'stops', stops)

            const startIdx = 0
            logger.info(process, 'startIdx', startIdx)
            const endIdx = stops.length - 1
            logger.info(process, 'endIdx', endIdx)

            const startStop = stops[startIdx]
            logger.info(process, 'startStop', startStop)
            const endStop = stops[endIdx]
            logger.info(process, 'endStop', endStop)

            if (
               !stops[startIdx].location?.position?.lat ||
               !stops[startIdx].location?.position?.lng ||
               !stops[endIdx].location?.position?.lat ||
               !stops[endIdx].location?.position?.lng
            ) {
               logger.info(
                  process,
                  'Missing address for start and/or end stops'
               )
               return
            }

            logger.info(process, `${stops.length} stops...`)
            const request = {
               origin: new google.maps.LatLng(
                  stops[0].location.position.lat,
                  stops[0].location.position.lng
               ),
               destination: new google.maps.LatLng(
                  stops[stops.length - 1].location.position.lat,
                  stops[stops.length - 1].location.position.lng
               ),
               waypoints: [],
               travelMode: 'DRIVING',
            }
            for (let i = 1; i < stops.length - 1; i++) {
               if (stops[i]) {
                  request.waypoints.push({
                     location: new google.maps.LatLng(
                        stops[i].location.position.lat,
                        stops[i].location.position.lng
                     ),
                     stopover: true,
                  })
               }
            }
            logger.info(process, 'request', request)

            const result = await directionsService.route(request)
            logger.info(process, 'result', result)

            // Render route on Google Map
            directionsRenderer.setDirections(result)

            // Calculate total distance and duration
            let distance = 0,
               duration = 0

            logger.info(process, 'legs', result.routes[0].legs)

            for (const leg of result.routes[0].legs) {
               distance += leg.distance.value
               duration += leg.duration.value
            }
            logger.info(process, 'distance-meters', distance)
            logger.info(process, 'duration-seconds', duration)

            totalDistance.value = Math.round(
               utils.convertDistance({
                  inType: 'meters',
                  inValue: distance,
                  outType: 'miles',
               })
            )
            logger.info(process, 'distance-miles', totalDistance.value)

            totalDuration.value = Math.round(
               utils.convertTime({
                  inType: 'seconds',
                  inValue: duration,
                  outType: 'minutes',
               })
            )
            logger.info(process, 'duration-mins', totalDuration.value)
         } catch (error) {
            logger.error(error.message)
         }
      }

      const setMarkers = () => {
         markers.value = []
         if (model.value.stops.length === 2) {
            logger.info('setMarkers', 'only 2 markers remain')
            // markers.value = []
            return
         }

         logger.info('setMarkers', 'more than 2 markers exist')
         for (let stop of model.value.stops) {
            stop = cloneDeep(stop)

            // If the stop doesn't already have an assigned location
            // we try to get it from the associated project else
            // associated organization
            if (!stop.location) {
               if (stop.projectObj?.location) {
                  stop.location = stop.projectObj.location
               } else if (stop.orgObj?.location) {
                  stop.location = stop.orgObj.location
               } else {
                  // The location could not be derived so excluding
                  // this stop from being a map marker
                  logger.info(
                     'setMarkers',
                     'Stop does not contain location info'
                  )
                  // markers.value = markers.value.filter(
                  //    (marker) => marker.label !== stop.label
                  // )
                  continue
               }
            }

            // Sets the marker location to drop, if exists, else position
            // The drop value would only exist if the user defining the address
            // manually drug the marker to a different spot on the map.
            if (stop.location.drop) {
               logger.info('Stop includes a drop location')
               stop.location.position = stop.location.drop
               delete stop.location.drop
            }
            logger.info('setMarkers', 'stop location', stop.location.position)

            // This filter removes the current marker if it
            // already exists.  It is being replaced...
            // markers.value = markers.value.filter(
            //    (marker) => marker.label !== stop.label
            // )

            // The new marker, scrubbed from the stop data, is inserted
            // into markers array which is then read by the Google Map
            markers.value.push({ ...stop, id: stop.label })
         }
      }

      onMounted(async () => {
         logger.info('onMounted', 'Running onMount prop')
         try {
            emit('mounted')

            logger.info('onMounted', 'initiating DirectionsService')
            directionsService = new google.maps.DirectionsService()

            logger.info('onMounted', 'initializing DirectionsRenderer')
            directionsRenderer = new google.maps.DirectionsRenderer()

            logger.info('onMounted', 'configuring map markers')
            setMarkers()
         } catch (error) {
            logger.error('onMounted', error.message)
         }
      })

      watch(
         () => props.opDispatch,
         () => {
            logger.info('watch-opDispatch', props.opDispatch)
            model.value = props.opDispatch
            setMarkers()
            setRoutes()
         }
      )

      watch(
         () => model.value,
         async (after, before) => {
            before = cloneDeep(before)
            logger.info('watch-model', 'before', before)

            after = cloneDeep(after)
            logger.info('watch-model', 'after', after)

            const stateObj = cloneDeep(store.state.dispatch.items[after.id])
            logger.info('watch-model', 'stateObj', stateObj)

            const diffs = utils.objectDiffs(after, stateObj)
            logger.info('watch-model', 'diffs', diffs)

            // Don't write to database when no changes occurred
            if (stateObj && !Object.keys(diffs).length) return

            logger.info('watch-model', 'model', model.value)
            // logger.info(
            //    'watch-model',
            //    'map',
            //    map.value ? map.value.$mapObject : ''
            // )
            try {
               const dispatchDoc = {
                  ...model.value,
                  tenantId: selectedTenant.value,
                  id: `${String(model.value.timestamp)}_${
                     model.value.operatorId
                  }`,
               }

               if (diffs.stops) {
                  let beforeStopDiffs = []
                  if (stateObj) {
                     beforeStopDiffs = utils.objectDiffs(
                        stateObj.stops,
                        after.stops
                     )
                  }
                  let afterStopDiffs = after.stops
                  if (stateObj) {
                     afterStopDiffs = utils.objectDiffs(
                        after.stops,
                        stateObj.stops
                     )
                  }
                  logger.info(
                     'watch-model',
                     'beforeStopDiffs',
                     beforeStopDiffs,
                     beforeStopDiffs.length
                  )
                  logger.info(
                     'watch-model',
                     'afterStopDiffs',
                     afterStopDiffs,
                     afterStopDiffs.length
                  )

                  for (let i = 0; i < beforeStopDiffs.length; i++) {
                     const beforeStop = beforeStopDiffs[i]
                     if (beforeStop && beforeStop.assetId) {
                        const stop = stateObj.stops[i]
                        const orderId = stop.id
                        order.update({
                           id: orderId,
                           tenantId: stop.tenantId,
                           assetId: '',
                        })
                     }
                  }

                  // Update related asset values on stop
                  for (let i = 0; i < afterStopDiffs.length; i++) {
                     const afterStop = afterStopDiffs[i]
                     if (afterStop && afterStop.assetId) {
                        const stop = after.stops[i]
                        const assetId = stop.assetId
                        const orderId = stop.id
                        order.update({
                           id: orderId,
                           tenantId: stop.tenantId,
                           assetId,
                        })
                        const asset = cloneDeep(
                           store.getters['assets/item'](assetId)
                        )
                        logger.info('watch-model', 'asset', asset)
                        let label = asset.name
                        if (asset.assetNumber) {
                           label += ` (${asset.assetNumber})`
                        }
                        label += ` [${asset.status}]`

                        if (
                           !dispatchDoc.stops[i] ||
                           !dispatchDoc.stops[i].asset ||
                           dispatchDoc.stops[i].asset !== label
                        ) {
                           dispatchDoc.stops[i].asset = label
                           dispatchDoc.stops[i].assetObj = asset
                        }
                     }
                  }
               }
               logger.info(
                  'watch-model',
                  'dispatch-add',
                  'dispatchDoc',
                  dispatchDoc
               )
               await dispatch.add(dispatchDoc)

               setMarkers()
               setRoutes()
               emit('update')
            } catch (error) {
               logger.error('watch-model', error.message)
            }
         },
         { deep: true }
      )

      watch(
         () => markers.value,
         async () => {
            logger.info('watch-markers')
            if (map.value) {
               await map.value.$mapPromise
               await setRoutes()
            }
         }
      )

      watch(
         () => map.value,
         async (val) => {
            // const mapValue = val
            // logger.info('watch-map', 'watch mapValue', cloneDeep(mapValue))
            if (!val) {
               return
            }

            // const mapObject = await val.$mapPromise
            // logger.info('watch-map', 'mapObject', mapObject)
            // logger.info('watch map', mapObject)
            await setRoutes()
         }
      )

      return {
         showAddStop,
         model,
         truckOptions,
         assetOptions,
         totalDistance,
         totalDuration,
         markers,
         map,
         updateAddress(stopId, location) {
            const stopIdx = model.value.stops.findIndex((f) => f.id === stopId)
            model.value.stops[stopIdx].location = location
            model.value.stops[stopIdx].address = location.address
         },
         getStopIcon(stop) {
            if (!stop.location) {
               return { name: 'pending', color: 'grey' }
            }

            if (stop.status?.toLowerCase() === 'complete') {
               return { name: 'check_circle_outline', color: 'positive' }
            }

            return { name: 'radio_button_unchecked', color: 'grey' }
         },
         clickAddStop() {
            showAddStop.value = true
         },
         saveAddStop(stop) {
            logger.info('saveAddStop', 'stop', stop)
            stop = {
               ...stop,
               id: ulid(),
               name: stop.label,
            }
            logger.info('saveAddStop', 'stop2', stop)
            logger.info('saveAddStop', 'model.value', model.value)
            model.value.stops.splice(model.value.stops.length - 1, 0, stop)
         },
         async sendDispatch(channel) {
            // Verify operator can receive message
            const hasEmail = !!model.value.operatorObj?.email
            const hasPhone = !!model.value.operatorObj?.phone
            if (channel === 'email' && !hasEmail) {
               Notify.create({
                  type: 'warning',
                  message: 'Operator does not have an email address assigned.',
               })
               return
            }
            if (channel === 'sms' && !hasPhone) {
               Notify.create({
                  type: 'warning',
                  message: 'Operator does not have a phone number assigned.',
               })
               return
            }

            // Generate text version
            let textMessage = '----\r\n'
            textMessage += `New Dispatch for ${new Date(
               model.value.timestamp
            ).toLocaleDateString()}\r\n`
            textMessage += '----\r\n'
            for (const stop of model.value.stops) {
               textMessage += `${stop.label}\r\n`

               const truckObj = store.state.assets.items[stop.truckId]
               if (truckObj && truckObj.name) {
                  textMessage += `Truck: ${truckObj.name}\r\n`
               }

               textMessage += `Address: ${stop.address}\r\n`

               if (stop.id === 'start' || stop.id === 'end') {
                  textMessage += '----\r\n'
                  continue
               }

               if (stop.notes) {
                  textMessage += `Notes: ${stop.notes}\r\n`
               }

               if (stop.type && stop.type === 'manual') {
                  textMessage += '----\r\n'
                  continue
               }

               textMessage += `Service: ${stop.service}\r\n`

               const assetObj = store.state.assets.items[stop.assetId]
               if (assetObj && assetObj.name && assetObj.assetNumber) {
                  textMessage += `Asset: ${assetObj.name} (${assetObj.assetNumber})\r\n`
               } else {
                  textMessage += `Asset: TBD\r\n`
               }

               textMessage += `Project: ${stop.project}\r\n`

               textMessage += `Work Order: ${stop.label}\r\n`

               if (stop.projectObj && stop.projectObj.contactId) {
                  const contact =
                     store.state.users.items[stop.projectObj.contactId]
                  textMessage += `Contact: ${contact.name}\r\n`
                  textMessage += `Contact Phone: ${contact.phone || ''}\r\n`
                  textMessage += `Contact Email: ${contact.email || ''}\r\n`
               } else {
                  textMessage += `Contact: Not Available\r\n`
               }

               textMessage += '----\r\n'
            }
            logger.info('sendDispatch', 'textMessage', textMessage)

            // Generate html version
            let htmlMessage = '<hr><b/>'
            for (const stop of model.value.stops) {
               htmlMessage += `<p><strong>${stop.label}</strong><br/>`

               const truckObj = store.state.assets.items[stop.truckId]
               if (truckObj && truckObj.name) {
                  htmlMessage += `Truck: ${truckObj.name}<br/>`
               }

               htmlMessage += `Address: ${stop.address}<br/>`

               if (stop.id === 'start' || stop.id === 'end') {
                  htmlMessage += '</p><hr><br/>'
                  continue
               }

               if (stop.notes) {
                  htmlMessage += `Notes: ${stop.notes}<br/>`
               }

               if (stop.type && stop.type === 'manual') {
                  htmlMessage += '</p><hr><br/>'
                  continue
               }

               htmlMessage += `Service: ${stop.service}<br/>`

               const assetObj = store.state.assets.items[stop.assetId]
               if (assetObj && assetObj.name && assetObj.assetNumber) {
                  htmlMessage += `Asset: ${assetObj.name} (${assetObj.assetNumber})<br/>`
               } else {
                  htmlMessage += `Asset: TBD<br/>`
               }

               htmlMessage += `Project: ${stop.project}<br/>`

               htmlMessage += `Work Order: ${stop.label}<br/>`

               if (stop.projectObj && stop.projectObj.contactId) {
                  const contact =
                     store.state.users.items[stop.projectObj.contactId]
                  htmlMessage += `Contact: ${contact.name}<br/>`
                  htmlMessage += `Contact Phone: ${contact.phone || ''}<br/>`
                  htmlMessage += `Contact Email: ${contact.email || ''}<br/>`
               } else {
                  htmlMessage += `Contact: Not Available<br/>`
               }

               htmlMessage += '</p><hr><br/>'
            }
            logger.info('sendDispatch', 'htmlMessage', htmlMessage)

            // Send
            let result
            switch (channel) {
               case 'sms':
                  result = await axios.post('/sms/send', {
                     to: model.value.operatorObj.phone,
                     body: textMessage,
                  })
                  break
               case 'email':
                  result = await axios.post('/email/sendDispatch', {
                     recipientName: model.value.operatorObj.name,
                     recipientEmail: model.value.operatorObj.email,
                     dispatchText: textMessage,
                     dispatchHtml: htmlMessage,
                  })
                  break
            }
            logger.info('sendDispatch', 'result', result)
            if (result.status == 204) {
               Notify.create('Message sent')
            } else {
               Notify.create({ type: 'negative', message: result.statusText })
            }
         },
      }
   },
})
</script>

<style lang="sass"></style>
