<template>
   <q-tooltip
      class="bg-transparent"
      :anchor="anchor"
      :delay="delay"
      max-width="240px"
      :offset="offset"
      :self="self"
      :target="target"
      transition-show="scale"
      transition-hide="scale"
   >
      <q-card>
         <q-card-section class="q-py-xs q-px-md bg-secondary text-white">
            <div class="text-overline">Tooltip</div>
            <div v-if="title" class="text-subtitle1 text-weight-bold">
               {{ title }}
            </div>
         </q-card-section>
         <q-card-section>
            <div class="text-caption text-primary">
               <slot></slot>
            </div>
         </q-card-section>
      </q-card>
   </q-tooltip>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
   name: 'TooltipComponent',

   props: {
      delay: {
         type: Number,
         default: 300,
      },
      anchor: {
         type: String,
         default: 'center right',
      },
      offset: {
         type: Array,
         default: () => [10, 10],
      },
      self: {
         type: String,
         default: 'center left',
      },
      target: {
         type: [Boolean, String],
         default: true,
      },
      title: {
         type: String,
      },
   },

   setup() {
      return {}
   },
})
</script>

<style lang="sass"></style>
