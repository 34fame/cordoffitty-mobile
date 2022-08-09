/**
 * @function
 * @name convertDistance
 * @description Converts distance from one format to another
 * @param  {string} [inType=kilometers] Format of the input
 * @param  {number} inValue             Value of input to be converted
 * @param  {string} [outType=miles]     Format of the output
 * @return {string}                     Returns converted distance
 */
export const convertDistance = ({
   inType = 'kilometers',
   inValue,
   outType = 'miles',
}) => {
   if (inValue === 0) return 0

   // Convert inValue to meters
   let meters
   switch (inType) {
      case 'meters':
         meters = inValue
         break
      case 'kilometers':
         meters = inValue * 1000
         break
      case 'miles':
         meters = inValue * 1609
         break
   }

   if (!meters) {
      throw Error('Conversion not supported')
   }

   // Convert from meters to outType
   switch (outType) {
      case 'meters':
         return meters
      case 'kilometers':
         return meters / 1000
      case 'miles':
         return meters / 1609
   }

   throw Error('Conversion not supported')
}

/**
 * @function
 * @name convertTime
 * @description Converts time/duration from one format to another
 * @param  {string} [inType=seconds]    Format of the input
 * @param  {number} inValue             Value of input to be converted
 * @param  {string} [outType=minutes]   Format of the output
 * @return {string}                     Returns converted time
 */
export const convertTime = ({
   inType = 'seconds',
   inValue,
   outType = 'minutes',
}) => {
   if (inValue === 0) return 0

   let milliseconds
   switch (inType) {
      case 'milliseconds':
         milliseconds = inValue
         break
      case 'seconds':
         milliseconds = inValue * 1000
         break
      case 'minutes':
         milliseconds = inValue * 60000
         break
      case 'hours':
         milliseconds = inValue * 3.6e6
         break
   }

   if (!milliseconds) {
      throw Error('Conversion not supported')
   }

   switch (outType) {
      case 'milliseconds':
         return milliseconds
      case 'seconds':
         return milliseconds / 1000
      case 'minutes':
         return milliseconds / 60000
      case 'hours':
         return milliseconds / 3.6e6
   }

   throw Error('Conversion not supported')
}
