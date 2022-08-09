import * as globals from './globals'
import * as convert from './convert'
import * as dates from './dates'
import * as localization from './localization'
import * as is from './is'
import * as jwt from './jwt'
import * as objects from './objects'
import * as sorting from './sorting'
import * as strings from './strings'
import * as wait from './wait'

export default function useUtils() {
   return {
      ...globals,
      ...convert,
      ...dates,
      ...localization,
      ...is,
      ...jwt,
      ...objects,
      ...sorting,
      ...strings,
      ...wait,
   }
}
