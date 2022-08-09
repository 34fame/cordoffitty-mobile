<template>
   <GMapMap
      :center="centerMap"
      :zoom="zoomMap"
      :map-type-id="mapType"
      :options="options"
      :tilt="0"
      :style="`width: ${width}; height: ${height}`"
   >
      <GMapCluster :zoomOnClick="true">
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
         >
            <GMapInfoWindow
               :closeClick="true"
               :opened="openMarker === marker.id"
               @clickClose="openMarker = null"
            >
               <MapInfo :item="marker" />
            </GMapInfoWindow>
         </GMapMarker>
      </GMapCluster>
   </GMapMap>
</template>

<script>
import {
   defineAsyncComponent,
   defineComponent,
   onMounted,
   onBeforeUnmount,
   ref,
   watch,
} from 'vue'

export default defineComponent({
   name: 'GMap',

   components: {
      MapInfo: defineAsyncComponent(() =>
         import('components/maps/MarkerInfo.vue')
      ),
   },

   props: {
      poi: {
         type: Array,
      },
      center: {
         type: Object,
         default: () => {
            return { lat: 38.2533742, lng: -100.6177122 }
         },
      },
      zoom: {
         type: Number,
         default: 4,
      },
      mapType: {
         type: String,
         default: 'hybrid',
      },
      options: {
         type: Object,
         default: () => {
            return {
               zoomControl: true,
               mapTypeControl: true,
               scaleControl: true,
               streetViewControl: true,
               rotateControl: false,
               disableDefaultUi: false,
               fullscreenControl: true,
            }
         },
      },
      height: {
         type: String,
         default: '400px',
      },
      width: {
         type: String,
         default: '100%',
      },
   },

   setup(props, { emit }) {
      const centerMap = ref(props.center)
      const zoomMap = ref(props.zoom)
      const openMarker = ref(null)
      const markers = ref([])

      const buildMarkers = () => {
         let pois = []
         for (const marker of props.poi) {
            pois.push(marker.id)

            const exists = markers.value.findIndex((f) => f.id === marker.id)
            if (exists >= 0) {
               markers.value.splice(exists, 1, marker)
               continue
            }

            if (marker.dataType === 'assets') {
               markers.value.push({
                  ...marker,
                  location: {
                     ...marker.location,
                     icon: 'images/custom-markers/above_ground.png',
                  },
               })
               continue
            }

            if (marker.dataType === 'projects') {
               markers.value.push({
                  ...marker,
                  location: {
                     ...marker.location,
                     icon: 'images/custom-markers/construction.png',
                  },
               })
               continue
            }

            if (marker.dataType === 'orders') {
               markers.value.push({
                  ...marker,
                  location: {
                     ...marker.location,
                     icon: 'images/custom-markers/repair.png',
                  },
               })
               continue
            }

            if (marker.dataType === 'orgs') {
               markers.value.push({
                  ...marker,
                  location: {
                     ...marker.location,
                     icon: 'images/custom-markers/office-building.png',
                  },
               })
               continue
            }

            markers.value.push(marker)
         }

         markers.value = markers.value.filter((f) => pois.includes(f.id))

         if (markers.value.length === 1) {
            const position =
               markers.value[0].location.drop ||
               markers.value[0].location.position
            centerMap.value = position
            zoomMap.value = 18
         }
      }

      onMounted(() => {
         buildMarkers()

         // const el = document.getElementById
      })

      onBeforeUnmount(() => {})

      watch(
         () => props.poi,
         () => {
            buildMarkers()
         },
         { deep: true }
      )

      return {
         centerMap,
         zoomMap,
         openMarker,
         markers,
         clickMarker(m) {
            // if (openMarker.value === m.id) {
            //    openMarker.value = null
            // } else {
            openMarker.value = m.id
            // }
         },
         dragMarker(e) {
            const position = {
               lat: e.latLng.lat(),
               lng: e.latLng.lng(),
            }
            emit('onMove', position)
         },
      }
   },
})
</script>
