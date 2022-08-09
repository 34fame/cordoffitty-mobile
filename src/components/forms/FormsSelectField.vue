<template>
   <div class="column q-gutter-y-xs text-primary">
      <div>{{ label }}<span v-if="required" class="text-negative">*</span></div>
      <div class="row items-start q-gutter-x-xs no-wrap">
         <q-select
            bg-color="white"
            :clearable="required ? false : clearable"
            color="secondary"
            dense
            emit-value
            hide-bottom-space
            input-class="text-secondary"
            lazy-rules="ondemand"
            :mask="mask"
            map-options
            option-label="label"
            option-value="value"
            :options="useFilter ? filterOptions : options"
            options-selected-class="bg-grey-4 text-secondary"
            outlined
            :rules="rules"
            unmasked-value
            :use-input="useFilter"
            v-model="vModel"
            v-bind="$attrs"
            style="min-width: 256px"
            @input-value="(v) => (filterText = v)"
         >
            <template v-slot:selected-item="scope">
               <span class="text-secondary">{{ scope.opt.label }}</span>
            </template>
            <template
               v-if="options.length && options[0].icon"
               v-slot:option="scope"
            >
               <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                     <q-icon :name="scope.opt.icon" color="secondary" />
                  </q-item-section>
                  <q-item-section>
                     <q-item-label class="text-primary">{{
                        scope.opt.label
                     }}</q-item-label>
                  </q-item-section>
               </q-item>
            </template>
         </q-select>
         <q-icon v-if="tooltip" color="accent" name="help" size="xs">
            <Tooltip :title="label">{{ tooltip }}</Tooltip>
         </q-icon>
      </div>
   </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, computed, ref } from 'vue'

export default defineComponent({
   name: 'FormsSelectField',

   emits: ['update:modelValue'],

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
      modelValue: {
         type: [String, Number, Array, Object],
         required: true,
      },
      optionValue: {
         type: [String, Object],
      },
      options: {
         type: Array,
         required: true,
      },
      required: {
         type: [String, Boolean],
         default: false,
      },
      tooltip: {
         type: String,
      },
      clearable: {
         type: [String, Boolean],
         default: false,
      },
      type: {
         type: String,
         default: 'text',
      },
      useFilter: {
         type: Boolean,
         default: false,
      },
   },

   setup(props, { emit }) {
      const filterText = ref('')

      const vModel = computed({
         get: () => props.modelValue,
         set: (v) => emit('update:modelValue', v),
      })
      const filterOptions = computed(() => {
         const filtered = props.options.filter((i) => {
            if (i.label.toLowerCase().includes(filterText.value.toLowerCase()))
               return i
         })
         return filtered
      })
      const mask = computed(() => {
         switch (props.type) {
            default:
               return ''
         }
      })

      const rules = [
         (value) => !props.required || value.length > 0 || 'Value is required',
      ]

      return {
         vModel,
         filterText,
         filterOptions,
         mask,
         rules,
      }
   },
})
</script>

<style lang="sass"></style>
