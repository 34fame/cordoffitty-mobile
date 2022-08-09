<template>
   <div class="column q-gutter-y-xs text-primary">
      <div>{{ label }}</div>
      <q-input
         :autogrow="autogrow_"
         bg-color="white"
         color="primary"
         dense
         hide-bottom-space
         input-class="text-secondary"
         lazy-rules
         :mask="mask_"
         outlined
         readonly
         :rules="rules"
         :type="type_"
         unmasked-value
         v-model="vModel"
      >
         <template v-slot:append>
            <q-icon name="arrow_drop_down" />
         </template>

         <q-menu auto-close style="width: 75%">
            <q-list>
               <template v-for="option in options" :key="option.value">
                  <q-item-label
                     v-if="option.type === 'header'"
                     class="bg-grey-7 text-grey-1 text-subtitle1 text-weight-bold"
                     header
                     >{{ option.label }}</q-item-label
                  >
                  <q-item
                     v-else
                     :active="modelValue === option.value"
                     active-class="bg-grey-4 text-secondary"
                     clickable
                     v-ripple
                     @click="clickItem(option)"
                  >
                     <q-item-section v-if="option.icon" avatar>
                        <q-icon color="accent" :name="option.icon" />
                     </q-item-section>
                     <q-item-section>
                        <q-item-label>{{ option.label }}</q-item-label>
                        <q-item-label v-if="option.caption" caption>{{
                           option.caption
                        }}</q-item-label>
                     </q-item-section>
                  </q-item>
               </template>
            </q-list>
         </q-menu>
      </q-input>
   </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'

export default defineComponent({
   name: 'FormsInputListField',

   inheritAttrs: false,

   emits: ['update:modelValue'],

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
      options: {
         type: Array,
         required: true,
      },
      placeholder: {
         type: String,
         default: '',
      },
      required: {
         type: [String, Boolean],
         default: false,
      },
      type: {
         type: String,
         default: 'text',
      },
      autogrow: {
         type: [String, Boolean],
         default: false,
      },
   },

   setup(props, { emit }) {
      const showPassword = ref(false)

      const vModel = computed(() => {
         if (props.modelValue) {
            const optionArr = props.options.filter(
               (f) => f.value === props.modelValue
            )
            return optionArr[0].label
         }
         return ''
      })

      const autogrow_ = computed(() => {
         return props.autogrow === false ? false : true
      })

      const mask_ = computed(() => {
         switch (props.type) {
            case 'us-phone':
               return '(###) ### - ####'
            default:
               return props.mask
         }
      })

      const rules = [
         (value) => !props.required || value.length > 0 || 'Value is required',
      ]

      const type_ = computed(() => {
         switch (props.type) {
            case 'password':
               return showPassword.value ? 'text' : 'password'
            case 'us-phone':
               return 'text'
            case 'email':
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
         mask_,
         rules,
         type_,
         clickItem(item) {
            emit('update:modelValue', item.value)
         },
      }
   },
})
</script>

<style lang="sass"></style>
