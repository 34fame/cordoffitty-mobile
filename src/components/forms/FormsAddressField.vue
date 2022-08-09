<template>
   <div class="column q-gutter-y-xs text-primary">
      <div>{{ label }}</div>
      <div class="row items-start q-gutter-x-xs no-wrap">
         <label
            class="q-field row no-wrap items-start q-field--outlined q-input q-field--dense"
            for="autocomplete"
            style="min-width: 256px"
         >
            <div class="q-field__inner relative-position col self-stretch">
               <div
                  class="q-field__control bg-white relative-position row no-wrap"
               >
                  <div
                     class="q-field__control-container col relative-position row no-wrap q-anchor--skip"
                  >
                     <GMapAutocomplete
                        id="autocomplete"
                        class="q-field__native pac-target-input text-secondary"
                        :placeholder="placeholder"
                        :value="modelValue"
                        @place_changed="placeChanged"
                     />
                  </div>
               </div>
            </div>
         </label>
         <q-icon v-if="tooltip" color="accent" name="help" size="xs">
            <Tooltip :title="label">{{ tooltip }}</Tooltip>
         </q-icon>
      </div>
   </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, inject } from 'vue'

export default defineComponent({
   name: 'FormsAddressField',

   inheritAttrs: false,

   emits: ['update'],

   components: {
      Tooltip: defineAsyncComponent(() =>
         import('components/dialogs/Tooltip.vue')
      ),
   },

   props: {
      label: {
         type: String,
         required: true,
      },
      placeholder: {
         type: String,
         default: '',
      },
      modelValue: {
         type: String,
      },
      tooltip: {
         type: String,
      },
   },

   setup(props, { emit }) {
      const logger = inject('logger')

      return {
         placeChanged(val) {
            if (val && val !== {}) {
               logger.info('placeChanged', 'val', val)
               let postalCode = ''
               const postalCodeComponent = val.address_components.find((c) =>
                  c.types.includes('postal_code')
               )

               if (postalCodeComponent) {
                  postalCode = postalCodeComponent.long_name
               }

               const postalCodeSuffixComponent = val.address_components.find(
                  (c) => c.types.includes('postal_code_suffix')
               )

               if (postalCodeSuffixComponent) {
                  postalCode += `-${postalCodeSuffixComponent.long_name}`
               }

               emit('update', {
                  position: {
                     lat: val.geometry.location.lat(),
                     lng: val.geometry.location.lng(),
                  },
                  address: val.formatted_address,
                  placeId: val.place_id,
                  name: val.name,
                  vicinity: val.vicinity,
                  postalCode,
               })
            } else {
               emit('update', null)
            }
         },
      }
   },
})
</script>

<style lang="sass">
.pac-container
   z-index: 6000
</style>
