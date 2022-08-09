<template>
   <div class="column q-gutter-y-xs text-primary">
      <div>{{ label }}</div>
      <div class="row items-start q-gutter-x-xs no-wrap">
         <q-input
            input-class="text-secondary"
            bg-color="white"
            color="primary"
            dense
            hide-bottom-space
            readonly
            :rules="rules"
            outlined
            style="width: 256px"
            v-model="dateInput"
            @click="clickDateInput"
         >
            <template v-slot:append>
               <q-icon name="fas fa-calendar" @click="clickDateInput" />
            </template>
         </q-input>
         <q-date
            v-if="showDatePicker"
            color="accent"
            mask="MMM DD, YYYY"
            minimal
            v-model="datePicker"
         />
         <q-icon v-if="tooltip" color="accent" name="help" size="xs">
            <Tooltip :title="label">{{ tooltip }}</Tooltip>
         </q-icon>
      </div>
   </div>
</template>

<script>
import {
   defineComponent,
   defineAsyncComponent,
   onMounted,
   ref,
   watch,
} from 'vue'
import { date } from 'quasar'

export default defineComponent({
   name: 'FormsDateField',

   inheritAttrs: false,

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
         type: [String, Number],
         required: true,
      },
      events: {
         type: Array,
      },
      readonly: {
         type: [String, Boolean],
         default: false,
      },
      required: {
         type: [String, Boolean],
         default: false,
      },
      tooltip: {
         type: String,
      },
   },

   setup(props, { emit }) {
      const showDatePicker = ref(false)
      const dateInput = ref('')
      const datePicker = ref(
         date.formatDate(new Date(props.modelValue), 'MMM DD, YYYY')
      )

      const rules = [
         (value) => !props.required || value.length > 0 || 'Value is required',
      ]

      onMounted(
         () =>
            (dateInput.value = date.formatDate(
               datePicker.value,
               'MMM DD, YYYY'
            ))
      )

      watch(
         () => props.modelValue,
         () => {
            datePicker.value = props.modelValue
               ? date.formatDate(new Date(props.modelValue), 'MMM DD, YYYY')
               : ''
         }
      )

      watch(
         () => datePicker.value,
         () => {
            showDatePicker.value = false
            dateInput.value = date.formatDate(datePicker.value, 'MMM DD, YYYY')
            emit(
               'update:modelValue',
               Number(date.formatDate(datePicker.value, 'x'))
            )
         }
      )

      return {
         showDatePicker,
         dateInput,
         datePicker,
         rules,
         clickDateInput() {
            // if (!props.readonly === false) {
            showDatePicker.value = true
            // }
         },
      }
   },
})
</script>

<style lang="sass"></style>
