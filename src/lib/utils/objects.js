import transform from 'lodash/transform'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'

/**
 * @function
 * @name objectDiffs
 * @description Performs a deep diff between two objects
 * @param  {Object} newObj    Object to compare
 * @param  {Object} baseObj   Object to compare with
 * @return {Object}           Object containing the differences
 */
export const objectDiffs = (newObj, baseObj) => {
   if (newObj && !baseObj) return newObj
   if (!newObj && baseObj) return baseObj

   return transform(newObj, (result, value, key) => {
      if (!isEqual(value, baseObj[key])) {
         result[key] =
            isObject(value) && !isArray(value) && isObject(baseObj[key])
               ? objectDiffs(value, baseObj[key])
               : value
      }
   })
}

/**
 * @function
 * @name objectArrayToCsv
 * @description Produces comma-delimited text from an object array
 * @param  {string[]} fields     Array of object keys (fields) to be used as headers in CSV
 * @param  {Object[]} objectArr  Array of objects that will be converted to rows of CSV text
 * @return {string}              Text results as CSV with headers and new line returns
 */
export const objectArrayToCsv = (fields, objectArr) => {
   try {
      if (typeof objectArr !== 'object') {
         objectArr = JSON.parse(objectArr)
      }
      if (!Array.isArray(objectArr)) throw new Error('Not an object array')

      let data = ''

      objectArr.forEach((row) => {
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
   } catch (error) {
      throw new Error(error)
   }
}
