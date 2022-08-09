<template>
   <q-layout view="hHh Lpr lff">
      <q-page-container>
         <router-view />
      </q-page-container>
   </q-layout>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { setCssVar } from 'quasar'

import useUtils from 'src/lib/utils'
import useTenant from 'src/modules/Tenants'

export default defineComponent({
   name: 'PublicLayout',

   setup() {
      const utils = useUtils()
      const tenant = useTenant()

      const logo = ref(require('assets/cordoffitty-light.png'))
      const brandName = ref('Cordoffitty')

      onMounted(async () => {
         const host = window.location.host
         const hostTenant = host.split('.')[0]
         const tenantDoc = await tenant.getFromHostPrefix(hostTenant)
         if (!tenantDoc) return null

         // Apply brand colors
         if (!tenantDoc.settings.brandColors) return null
         const brandColors = tenantDoc.settings.brandColors
         setCssVar('primary', brandColors.primary)
         setCssVar('secondary', brandColors.secondary)
         setCssVar('accent', brandColors.accent)
         setCssVar('dark', brandColors.dark)

         // Apply logo
         if (tenantDoc.settings.logo && tenantDoc.settings.logo.url) {
            logo.value = tenantDoc.settings.logo.url
         }

         // Apply brand name
         if (tenantDoc.settings.useCompanyName === true) {
            brandName.value = tenantDoc.tenant.name
         }
      })

      return {
         logo,
         brandName,
         translate(key) {
            const translation = utils.translate({ key, toCase: 'title' })
            return translation
         },
      }
   },
})
</script>
