import useSort from 'src/lib/sorting'

const sort = useSort()

const state = {
   items: {},
   loading: false,
   counter: 0,
}

const mutations = {
   set: (state, doc) => {
      state.items[doc.id] = doc
   },

   remove: (state, id) => {
      delete state.items[id]
   },

   setLoading: (state, value) => {
      state.loading = value
   },

   clear: (state) => {
      state.items = {}
      state.loading = false
   },
}

const getters = {
   all: (state) => {
      const arr = Object.keys(state.items)
      return state.items[arr[0]]
   },

   assetCategories: (state, getters) => {
      let arr = getters.all.assetCategories
      arr = sort.sortArray(arr, ['name'])
      arr = arr.map((i) => {
         return {
            icon: i.icon,
            label: i.name,
            value: i.name,
         }
      })
      return arr
   },
}

export default {
   namespaced: true,
   getters,
   mutations,
   state,
}
