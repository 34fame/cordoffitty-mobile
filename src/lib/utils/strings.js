import { customAlphabet } from 'nanoid'

/**
 * @function
 * @name isString
 * @description Determine if value is a string
 * @param {any} value Value to test for string type
 * @return {boolean} Returns true if value is a string; else returns false
 */
export const isString = (value) => {
   return typeof value === 'string'
}

export const randomString = () => {
   return Math.random().toString(36).slice(2)
}

/**
 * @function
 * @name toCamelCase
 * @description Converts a string value to camel-case
 * @param   {string} str   String to be converted
 * @return  {string}       String in camel-case
 */
export const toCamelCase = (str) => {
   return str
      .trim()
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
}

/**
 * @function
 * @name toTitleCase
 * @description Capitalizes first letter of each word
 * @param   {string} str   String to be converted
 * @return  {string}       String after capitalization
 */
export const toTitleCase = (str) => {
   return str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase())
}

/**
 * @function
 * @name uniqueId
 * @description Generates a unique identifier
 * @param   {number} [length=10] Length of ID to getnerate
 * @param   {string} [alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ']
 *                               Characters that can be used to generate the ID
 * @return  {string}             Randomly generated unique identifier
 */
export const uniqueId = (
   length = 10,
   alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
) => {
   const nanoid = customAlphabet(alphabet, length)
   return nanoid()
}

/**
 * @function
 * @name formatPhone
 * @description Formats phone number to (999) 999-9999
 * @param   {string|number} phoneNumber   Value containing phone number in "any" format
 * @return  {string}                      Formatted phone number
 */
export const formatPhone = (phoneNumber) => {
   try {
      if (!phoneNumber) return ''
      if (typeof phoneNumber === 'number') phoneNumber = String(phoneNumber)
      phoneNumber.replace(/[^0-9]/g, '')
      if (phoneNumber.length !== 10) return phoneNumber

      const areaCode = phoneNumber.substr(0, 3)
      const prefix = phoneNumber.substr(3, 3)
      const suffix = phoneNumber.substr(6)
      return `(${areaCode}) ${prefix}-${suffix}`
   } catch (error) {
      console.error('formatPhone', error.message)
      return ''
   }
}
