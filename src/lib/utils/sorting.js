import _groupBy from 'lodash/groupBy'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'
import sortedUniq from 'lodash/sortedUniq'

export const sortArray = (items, sortFields = [], sortOrders = []) => {
   if (sortFields.length === 0) {
      return sortedUniq(items)
   }
   if (sortFields.length === sortOrders.length) {
      return orderBy(items, sortFields, sortOrders)
   }
   return sortBy(items, sortFields)
}

export const sortObject = (items, sortFields = [], sortOrders = []) => {
   let collection = []
   Object.keys(items).map((key) => {
      let item = {
         ...items[key],
         id: items[key].id ? items[key].id : key,
      }
      collection.push(item)
   })
   return sortArray(collection, sortFields, sortOrders)
}

export const filterArray = (items, filterBy, filterFields = []) => {
   if (!filterBy.length) return items
   let res = []
   items.map((item) => {
      if (filterFields.length) {
         filterFields.map((field) => {
            let match = !!includes(
               item[field].toLowerCase(),
               filterBy.toLowerCase()
            )
            if (match) {
               res.push(item)
            }
         })
      } else {
         Object.keys(item).map((key) => {
            let isString = typeof item[key] === 'string'
            if (isString) {
               let match = !!includes(
                  item[key].toLowerCase(),
                  filterBy.toLowerCase()
               )
               if (match) {
                  res.push(item)
               }
            }
         })
      }
   })
   return uniq(res)
}

export const groupArray = (items, groupBy) => {
   return _groupBy(items, groupBy)
}

export const groupArrayOfObjects = (items, groupBy) => {
   let result = {}
   let groupByParts = groupBy.split('.')
   items.forEach((item) => {
      if (groupByParts.length === 2) {
         if (!result[item[groupByParts[0]][groupByParts[1]]]) {
            result[item[groupByParts[0]][groupByParts[1]]] = []
         }
         result[item[groupByParts[0]][groupByParts[1]]].push(item)
         return
      }
      if (!result[item[groupBy]]) {
         result[item[groupBy]] = []
      }
      result[item[groupBy]].push(item)
   })
   return result
}
