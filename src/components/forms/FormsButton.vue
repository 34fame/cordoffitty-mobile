<template>
   <q-btn
      :data-cy="dataCy"
      class="col"
      color="secondary"
      :disable="disable"
      :label="label"
      no-caps
      :outline="outline_"
      :type="type"
      @click="clickButton"
   />
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
   name: 'FormsButton',

   props: {
      label: {
         type: String,
         required: true,
      },
      type: {
         type: String,
      },
      class: {
         type: String,
         default: 'primary',
      },
      disable: {
         type: Boolean,
         default: false,
      },
      dataCy: {
         type: String,
      },
   },

   setup(props, { emit }) {
      const outline_ = computed(() =>
         props.class === 'primary' ? false : true
      )

      const clickButton = () => {
         emit('onClick')
      }

      return { outline_, clickButton }
   },
})
</script>

<style lang="sass"></style>
