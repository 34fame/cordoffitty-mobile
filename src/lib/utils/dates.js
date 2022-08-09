import { date } from 'quasar'

const MILLISECONDS_IN_HOUR = 3.6e6

/**
 * @function
 * @name inferDateFormat
 * @description Converts a timestamp to a readable string
 *                Format options can be found here https://quasar.dev/quasar-utils/date-utils#format-for-display
 * @param  {number} [timestamp=now] Date as epoch in milliseconds
 * @param  {string} format          Format e.g. 'MM/DD/YYYY'
 * @return {string}                 Returns formatted date string
 */
export const inferDateFormat = ({
   timestamp = new Date().valueOf(),
   format,
}) => {
   try {
      const dt = new Date(timestamp)
      if (format) {
         return date.formatDate(dt, format)
      }
      return dt.toLocaleString()
   } catch (error) {
      throw new Error(error)
   }
}

/**
 * @function
 * @name readableDate
 * @description Converts a timestamp to a readable string
 * @param  {number} [timestamp=now] Date as epoch in milliseconds
 * @param  {string} format          Format e.g. 'MM/DD/YYYY'
 * @return {string}                 Returns formatted date string
 */
export const readableDate = ({ timestamp = new Date().valueOf(), format }) => {
   try {
      const dt = new Date(timestamp)
      if (format) {
         return date.formatDate(dt, format)
      }
      return dt.toLocaleString()
   } catch (error) {
      throw new Error(error)
   }
}

/**
 * @function
 * @name adjustDate
 * @description Adjusts the date forward or backward
 * @param  {number} [timestamp=now]       Date as epoch in milliseconds
 * @param  {object} offset                Offsets of the desired date elements
 *                For more details, this is the same format as the parameter of `addToDate` and `subtractFromDate`
 *                in the Quasar date utils: https://quasar.dev/quasar-utils/date-utils#add-subtract
 * @param  {'add'|'subtract'} operation   Determines if the offset will be added or subtracted
 * @return {number}                    Returns new date timestamp
 */
export const adjustDate = ({
   timestamp = new Date().valueOf(),
   offset,
   operation = 'add',
}) => {
   const dt = new Date(timestamp)
   if (operation === 'add') {
      return date.addToDate(dt, offset)
   }
   return date.subtractFromDate(dt, offset)
}

export const diffInDays = (firstDate, secondDate) => {
   return Math.ceil(Math.abs(firstDate - secondDate) / (1000 * 60 * 60 * 24))
}

/**
 * @function
 * @name diffInHours
 * @description Returns the difference in timestamps in hours (rounded to 2 decimals)
 * @param  {number}  firstTimestamp   Typically older timestamp
 * @param  {number}  secondTimestamp  Typically new timestamp
 * @return {number}  Number of hours (secondTimestamp - firstTimestamp)
 */
export const diffInHours = (firstTimestamp, secondTimestamp) => {
   if (
      typeof firstTimestamp !== 'number' ||
      typeof secondTimestamp !== 'number'
   )
      return false
   let diff = secondTimestamp - firstTimestamp
   diff = diff / MILLISECONDS_IN_HOUR
   diff = Math.round(diff * 100) / 100
   return diff
}

export const startOfDay = (dt = new Date()) => {
   dt = new Date(dt)
   dt.setHours(0, 0, 0, 0)
   return dt.valueOf()
}

export const endOfDay = (dt = new Date()) => {
   dt = new Date(dt)
   dt.setHours(23, 59, 59, 999)
   return dt.valueOf()
}

export const startOfWeek = (dt = new Date(), weekStartsOn = 1) => {
   dt = new Date(dt)
   let start = dt.getDate() - dt.getDay() + weekStartsOn
   let startDt = new Date(dt.setDate(start))
   startDt.setHours(0, 0, 0, 0)
   return startDt.valueOf()
}

export const endOfWeek = (dt = new Date(), weekStartsOn = 1) => {
   dt = new Date(dt)
   let start = dt.getDate() - dt.getDay() + weekStartsOn
   let end = start + 6
   let endDt = new Date(dt.setDate(end))
   endDt.setHours(23, 59, 59, 999)
   return endDt.valueOf()
}

export const startOfMonth = (dt = new Date()) => {
   dt = new Date(dt)
   dt.setDate(1)
   dt.setHours(0, 0, 0, 0)
   return dt.valueOf()
}

export const endOfMonth = (dt = new Date()) => {
   dt.setMonth(dt.getMonth() + 1)
   dt.setDate(1)
   dt.setDate(dt.getDate() - 1)
   dt.setHours(23, 59, 59, 999)
   return dt.valueOf()
}

/**
 * @function
 * @name timeStringToTimestamp
 * @description Returns timestamp from a time string (e.g. "11:23 PM")
 * @param  {string} timeString   String containing time using "h:mm A" format
 * @return {number}              Timestamp using today for date and timeString for time
 */
export const timeStringToTimestamp = (timeStr) => {
   if (typeof timeStr !== 'string') return timeStr
   const strSplit = timeStr.split(' ')
   if (strSplit.length !== 2) return timeStr
   const timeSplit = strSplit[0].split(':')
   if (timeSplit.length !== 2) return timeStr

   let hours = Number(timeSplit[0])
   if (strSplit[1] === 'PM') hours += 12
   if (strSplit[1] === 'AM' && hours === 12) hours -= 12
   let minutes = Number(timeSplit[1])

   let dt = new Date()
   dt.setHours(hours)
   dt.setMinutes(minutes)
   dt.setSeconds(0)
   return dt.valueOf()
}
