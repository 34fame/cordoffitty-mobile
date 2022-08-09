<template>
   <div class="column q-gutter-y-xs text-primary">
      <div>{{ label }}<span v-if="required" class="text-negative">*</span></div>
      <div class="row items-start q-gutter-x-xs no-wrap">
         <q-input
            :data-cy="dataCy"
            input-class="text-secondary"
            :autofocus="autofocus_"
            :autogrow="autogrow_"
            bg-color="white"
            color="primary"
            dense
            hide-bottom-space
            lazy-rules
            :mask="mask_"
            outlined
            :placeholder="placeholder"
            :readonly="readonly_"
            :rules="rules"
            :step="step"
            :type="type_"
            unmasked-value
            v-model="vModel"
            style="min-width: 256px"
         >
            <template v-slot:append>
               <q-icon
                  v-if="type === 'password'"
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
               />
               <q-icon v-if="type === 'address'" name="place" />
               <q-icon v-if="type === 'email'" name="email" />
               <q-icon v-if="type === 'us-phone'" name="phone" />
               <q-icon v-if="type === 'url'" name="language" />
               <q-icon
                  v-if="type === 'date'"
                  name="fas fa-calendar"
                  class="cursor-pointer"
               >
                  <q-popup-proxy
                     ref="qDateProxy"
                     cover
                     transition-show="scale"
                     transition-hide="scale"
                  >
                     <q-date minimal v-model="vModel">
                        <div class="row items-center justify-end">
                           <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                           />
                        </div>
                     </q-date>
                  </q-popup-proxy>
               </q-icon>
            </template>
         </q-input>
         <q-icon v-if="tooltip" color="accent" name="help" size="xs">
            <Tooltip :title="label">{{ tooltip }}</Tooltip>
         </q-icon>
      </div>
   </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, computed, ref } from 'vue'
import { date } from 'quasar'

const crazyEmailRegex =
   /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

export default defineComponent({
   name: 'FormsInputField',

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
      mask: {
         type: String,
      },
      modelValue: {
         type: [String, Number],
         required: true,
      },
      placeholder: {
         type: String,
         default: '',
      },
      readonly: {
         type: [String, Boolean],
         default: false,
      },
      required: {
         type: [String, Boolean],
         default: false,
      },
      type: {
         type: String,
         default: 'text',
      },
      step: {
         type: String,
      },
      autofocus: {
         type: [String, Boolean],
         default: false,
      },
      autogrow: {
         type: [String, Boolean],
         default: false,
      },
      dataCy: {
         type: String,
      },
      tooltip: {
         type: String,
      },
   },

   setup(props, { emit }) {
      const showPassword = ref(false)

      const vModel = computed({
         get: () => {
            if (props.type === 'date') {
               let dt = new Date(props.modelValue)
               return date.formatDate(dt, 'MMM DD, YYYY')
            }
            return props.modelValue
         },
         set: (v) => {
            if (props.type === 'date') {
               let dt = date.extractDate(v, 'MMM DD, YYYY')
               v = dt.valueOf()
            }
            emit('update:modelValue', v)
         },
      })
      const autogrow_ = computed(() => {
         return props.autogrow === false ? false : true
      })
      const autofocus_ = computed(() => {
         return props.autofocus === false ? false : true
      })
      const mask2_ = computed(() => {
         if (props.type === 'date') {
            return 'MMM DD, YYYY'
         } else {
            return ''
         }
      })
      const mask_ = computed(() => {
         switch (props.type) {
            case 'us-phone':
               return '(###) ### - ####'
            case 'date':
               return ''
            default:
               return props.mask
         }
      })
      const readonly_ = computed(() => {
         return props.readonly === false ? false : true
      })

      const rules = [
         (value) => !props.required || value.length > 0 || 'Value is required',
         (value) =>
            props.type !== 'email' ||
            value.length === 0 ||
            value.match(crazyEmailRegex) ||
            'Not a valid email address',
      ]
      const type_ = computed(() => {
         switch (props.type) {
            case 'password':
               return showPassword.value ? 'text' : 'password'
            case 'us-phone':
               return 'text'
            case 'email':
               return 'text'
            case 'date':
               return 'text'
            case 'address':
               return 'text'
            case 'url':
               return 'text'
            default:
               return props.type
         }
      })

      return {
         vModel,
         showPassword,
         autogrow_,
         autofocus_,
         mask_,
         mask2_,
         readonly_,
         rules,
         type_,
      }
   },
})
</script>

<style lang="sass"></style>
