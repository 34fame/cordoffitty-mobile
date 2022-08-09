<template>
   <div class="column q-gutter-y-xs text-primary">
      <div>{{ label }}</div>
      <section class="column q-gutter-y-xs">
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
            v-model="timeInput"
            @click="clickTimeInput"
         >
            <template v-slot:append>
               <q-icon name="fas fa-clock" @click="clickTimeInput" />
            </template>
         </q-input>
         <q-time
            v-if="showTimePicker"
            color="accent"
            mask="h:mm A"
            v-model="timePicker"
         />
      </section>
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

export default defineComponent({
   name: 'FormsTimeField',

   inheritAttrs: false,

   emits: ['update:modelValue'],

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
   },

   setup(props, { emit }) {
      const showTimePicker = ref(false)
      const timeInput = ref('')
      const timePicker = ref(props.modelValue)

      const rules = [
         (value) => !props.required || value.length > 0 || 'Value is required',
      ]

      onMounted(() => (timeInput.value = timePicker.value))

      watch(
         () => timePicker.value,
         () => {
            showTimePicker.value = false
            timeInput.value = timePicker.value
            emit('update:modelValue', timePicker.value)
         }
      )

      return {
         showTimePicker,
         timeInput,
         timePicker,
         rules,
         clickTimeInput() {
            showTimePicker.value = true
         },
      }
   },
})
</script>

<style lang="sass"></style>
