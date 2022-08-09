import { store } from 'src/store'
import { i18n } from 'boot/i18n'

import * as strings from './strings'

/**
 * @function
 * @name translate
 * @description Returns i18n translation of word/phrase
 * @param  {string} key       i18n key for word/phrase
 * @param  {'lower'|'upper'|'title'|'none'} [toCase='none']    Case to return
 * @return {String}           Return translated word/phrase
 */
export const translate = ({ key, toCase }) => {
   const locale = i18n.global.locale || 'en'
   const settings = store.getters['settings/all']

   let translation = i18n.global.t(key)
   if (settings && settings.labels && settings.labels[key]) {
      translation = settings.labels[key][locale]
   }
   switch (toCase) {
      case 'lower':
         return translation.toLowerCase()
      case 'upper':
         return translation.toUpperCase()
      case 'title':
         return strings.toTitleCase(translation)
      default:
         return translation
   }
}
