<template>
   <q-card bordered flat style="width: 100%; max-width: 300px">
      <q-card-section horizontal>
         <q-card-section class="q-pt-xs column">
            <span class="text-overline">{{ item.type }}</span>
            <span class="text-body1 q-mt-sm q-mb-xs">{{ item.label }}</span>
            <span class="text-caption text-grey">
               <template v-if="item.dataType === 'assets'">
                  <section class="column">
                     <span>
                        Serial Number: {{ item.serialNumber || 'N/A' }}
                     </span>
                     <span>Status: {{ item.status }}</span>
                  </section>
               </template>

               <template v-if="item.dataType === 'projects'">
                  <section class="column">
                     <span>Organization: {{ item.org }}</span>
                     <span>Contact: {{ item.contact || 'N/A' }}</span>
                     <span>
                        Contact Phone: {{ item.contactPhone || 'N/A' }}
                     </span>
                     <span>
                        Contact Email: {{ item.contactEmail || 'N/A' }}
                     </span>
                  </section>
               </template>

               <template v-if="item.dataType === 'orders'">
                  <section class="column">
                     <span>Organization: {{ item.org }}</span>
                     <span>Project: {{ item.project || 'N/A' }}</span>
                     <span>Service: {{ item.service || 'N/A' }}</span>
                     <span>Asset: {{ item.asset || 'N/A' }}</span>
                     <span>Operator: {{ item.operator || 'N/A' }}</span>
                  </section>
               </template>
            </span>
         </q-card-section>
         <q-card-section class="col-2">
            <q-img :src="item.location.icon" width="32px" />
         </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-actions>
         <q-btn
            color="secondary"
            dense
            label="Go to Details"
            no-caps
            :to="{
               name: item.dataType,
               params: { id: item.id, tenantId: item.tenantId },
            }"
         />
         <template v-if="item.dataType === 'assets'">
            <q-btn-dropdown
               color="secondary"
               dense
               label="More Actions..."
               no-caps
            >
               <q-list>
                  <q-item clickable v-close-popup @click="clickRequestPickup()">
                     <q-item-section>
                        <q-item-label>Request Pickup</q-item-label>
                     </q-item-section>
                  </q-item>
                  <q-item
                     clickable
                     v-close-popup
                     @click="clickRequestService()"
                  >
                     <q-item-section>
                        <q-item-label>Request Service</q-item-label>
                     </q-item-section>
                  </q-item>
               </q-list>
            </q-btn-dropdown>
         </template>
      </q-card-actions>
   </q-card>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
   name: 'MarkerInfo',

   props: {
      item: {
         type: Object,
         required: true,
      },
   },

   setup(props) {
      return {
         clickDetails() {},
         clickRequestPickup() {},
         clickRequestService() {},
      }
   },
})
</script>
