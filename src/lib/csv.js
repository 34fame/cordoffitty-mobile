import { logger } from 'boot/logger'

export default function useCSV() {
   const fromJsonArray = (collection, jsonArr) => {
      let fields
      switch (collection) {
         case 'assets':
            fields = [
               'id',
               'assetNumber',
               'name',
               'latitude',
               'longitude',
               'serialNumber',
               'status',
            ]
            break
         case 'projects':
            fields = [
               'id',
               'pricingModel',
               'address',
               'name',
               'status',
               'poNumber',
               'orgId',
            ]
            break
         case 'orders':
            fields = [
               'id',
               'assetId',
               'dateCompleted',
               'description',
               'name',
               'operatorId',
               'orgId',
               'projectId',
               'serviceId',
               'status',
            ]
            break
         case 'orgs':
            fields = [
               'id',
               'pricingModel',
               'address',
               'description',
               'type',
               'phone',
               'name',
               'email',
               'status',
            ]
            break
         case 'services':
            fields = [
               'id',
               'name',
               'status',
               'billingFee',
               'billingSchedule',
               'type',
               'category',
               'description',
               'pricing',
            ]
            break
         case 'users':
            fields = [
               'id',
               'address',
               'phone',
               'name',
               'email',
               'title',
               'role',
               'status',
               'orgId',
            ]
            break
         case 'assetCategories':
            fields = ['icon', 'name', 'startingId']
            break
         case 'laborCategories':
            fields = ['name']
            break
         default:
            fields = ['id', 'name']
      }

      if (typeof jsonArr !== 'object') {
         jsonArr = JSON.parse(jsonArr)
      }

      let data = ''

      jsonArr.forEach((row) => {
         // Generate header row
         if (!data.length) {
            fields.forEach((field, idx) => {
               data += `"${field}"`
               if (idx === fields.length - 1) {
                  data += '\r\n'
               } else {
                  data += ','
               }
            })
         }

         // Generate data row
         fields.forEach((field, idx) => {
            if (typeof row[field] === 'object') {
               data += `"${JSON.stringify(row[field]).replace(/\"/g, "'")}"`
            } else {
               data += row[field] ? `"${row[field]}"` : '""'
            }
            if (idx === fields.length - 1) {
               data += '\r\n'
            } else {
               data += ','
            }
         })
      })

      return data
   }

   return { fromJsonArray }
}
