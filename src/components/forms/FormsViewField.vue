<template>
   <div class="column q-gutter-y-xs text-accent">
      <div class="text-caption text-uppercase">{{ label }}</div>
      <q-input
         autogrow
         :input-class="hasClass()"
         borderless
         dense
         :mask="mask_"
         readonly
         :type="type_"
         v-model="val"
         style="margin-top: -8px"
         @click="clickField"
      >
         <template v-slot:prepend>
            <q-icon
               v-if="type === 'address'"
               color="secondary"
               name="place"
               size="xs"
            />
            <q-icon
               v-if="type === 'us-phone'"
               class="cursor-pointer"
               color="secondary"
               name="phone"
               size="xs"
               @click="clickField"
            />
            <q-icon
               v-if="type === 'email'"
               class="cursor-pointer"
               color="secondary"
               name="email"
               size="xs"
               @click="clickField"
            />
            <q-icon
               v-if="type === 'url'"
               class="cursor-pointer"
               color="secondary"
               name="language"
               size="xs"
               @click="clickField"
            />
         </template>

         <template v-slot:append>
            <q-icon
               v-if="type === 'password'"
               :name="showPassword ? 'visibility_off' : 'visibility'"
               class="cursor-pointer"
               @click="showPassword = !showPassword"
            />
         </template>
      </q-input>
   </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import { date, openURL } from 'quasar'

export default defineComponent({
   name: 'FormsViewField',

   props: {
      label: {
         type: String,
         required: true,
      },
      mask: {
         type: String,
      },
      model: {
         type: [String, Number],
         required: true,
      },
      type: {
         type: String,
         default: 'text',
      },
   },

   setup(props) {
      const showPassword = ref(false)

      const val = computed(() => {
         switch (props.type) {
            case 'date':
               let value = new Date(props.model)
               return date.formatDate(value, 'MMM DD, YYYY')
            default:
               return props.model
         }
      })
      const mask_ = computed(() => {
         switch (props.type) {
            case 'us-phone':
               return '(###) ### - ####'
            default:
               return ''
         }
      })
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
            default:
               return props.type
         }
      })

      return {
         val,
         showPassword,
         mask_,
         type_,
         clickField() {
            switch (props.type) {
               case 'url':
                  if (props.model.startsWith('https://')) {
                     openURL(props.model)
                  } else {
                     openURL(`https://${props.model}`)
                  }
                  break
               case 'email':
                  openURL(`mailto:${props.model}`)
                  break
               case 'us-phone':
                  openURL(`tel:${props.model}`)
                  break
               default:
            }
         },
         hasClass() {
            let response = 'text-primary text-weight-medium'
            switch (props.type) {
               case 'email':
               case 'us-phone':
               case 'url':
                  return `${response} cursor-pointer`
               default:
                  return response
            }
         },
      }
   },
})
</script>

<style lang="sass"></style>
