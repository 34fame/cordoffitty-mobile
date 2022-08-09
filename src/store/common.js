import useSort from 'src/lib/sorting'

const sort = useSort()

export default function useCommon() {
   const state = () => {
      return {
         items: {},
         selected: '',
         filterBy: '',
         groupBy: '',
         sortFields: ['name'],
         orderBy: ['asc'],
         loading: false,
         counter: 0,
      }
   }

   const mutations = () => {
      return {
         set(state, doc) {
            state.items[doc.id] = doc
         },

         remove(state, id) {
            delete state.items[id]
         },

         setSelected(state, id = '') {
            state.selected = id
         },

         setFilterBy(state, value) {
            state.filterBy = value
         },

         setGroupBy(state, value) {
            state.groupBy = value
         },

         setSortFields(state, value) {
            state.sortFields = value
         },

         setOrderBy(state, value) {
            state.orderBy = value
         },

         setLoading(state, value) {
            state.loading = value
         },

         setCounter(state, value) {
            state.counter = value
         },

         clear(state) {
            state.items = {}
            state.selected = ''
            state.filterBy = ''
            state.groupBy = ''
            state.loading = false
         },
      }
   }

   const getters = () => {
      return {
         items: (state, getters, rootState) => {
            let arr = []
            objectIterator: for (const key in state.items) {
               let obj = {
                  id: key,
                  ...state.items[key],
               }
               fieldIterator: for (const field in state.items[key]) {
                  if (!state.items[key][field]) {
                     continue fieldIterator
                  }
                  switch (field) {
                     case 'tenantId':
                        if (rootState.tenants.items[obj[field]]) {
                           const tenant = {
                              ...rootState.tenants.items[obj[field]],
                           }
                           obj.tenantObj = tenant
                           obj.tenant = tenant?.name || ''
                        }
                        break
                     case 'orgId':
                        if (rootState.orgs.items[obj[field]]) {
                           const org = {
                              ...rootState.orgs.items[obj[field]],
                           }
                           obj.orgObj = org
                           obj.org = org?.name || ''
                        }
                        break
                     case 'projectId':
                        if (rootState.projects.items[obj[field]]) {
                           const project = {
                              ...rootState.projects.items[obj[field]],
                           }
                           obj.projectObj = project
                           obj.project = project?.name || ''
                        }
                        break
                     case 'orderId':
                        if (rootState.orders.items[obj[field]]) {
                           const order = {
                              ...rootState.orders.items[obj[field]],
                           }
                           obj.orderObj = order
                           obj.order = order?.name || ''
                        }
                        break
                     case 'serviceId':
                        if (rootState.services.items[obj[field]]) {
                           const service = {
                              ...rootState.services.items[obj[field]],
                           }
                           obj.serviceObj = service
                           obj.service = `${service.name} (${service.category})`
                        }
                        break
                     case 'assetId':
                        if (rootState.assets.items[obj[field]]) {
                           const asset = {
                              ...rootState.assets.items[obj[field]],
                           }
                           obj.assetObj = asset
                           if (!asset.name) return ''
                           obj.asset = asset.name
                           if (asset.assetNumber) {
                              obj.asset += ` (${asset.assetNumber})`
                           }
                           obj.asset += ` [${asset.status}]`
                        }
                        break
                     case 'contactId':
                        if (rootState.users.items[obj[field]]) {
                           const contact = {
                              ...rootState.users.items[obj[field]],
                           }
                           obj.contactObj = contact
                           obj.contact = contact?.name || ''
                           obj.contactPhone = contact?.phone || ''
                           obj.contactEmail = contact?.email || ''
                        }
                        break
                     case 'managerId':
                        if (rootState.users.items[obj[field]]) {
                           const manager = {
                              ...rootState.users.items[obj[field]],
                           }
                           obj.managerObj = manager
                           obj.manager = manager?.name || ''
                        }
                        break
                     case 'operatorId':
                        if (rootState.users.items[obj[field]]) {
                           const operator = {
                              ...rootState.users.items[obj[field]],
                           }
                           obj.operatorObj = operator
                           obj.operator = operator?.name || ''
                        }
                        break
                  }
               }
               arr.push(obj)
            }
            return arr
         },

         sorted:
            (state, getters) =>
            ({
               sortFields = state.sortFields,
               orderBy = state.orderBy,
               statusFilter = [],
               roleFilter = [],
               tenantFilter = '',
               orgFilter = '',
               projectFilter = '',
               between,
            }) => {
               let arr = getters.items
               if (!arr) return []

               if (statusFilter.length) {
                  arr = arr.filter((f) => statusFilter.includes(f.status))
               }
               if (roleFilter.length) {
                  arr = arr.filter((f) => roleFilter.includes(f.role))
               }
               if (tenantFilter.length) {
                  arr = arr.filter((f) => f.tenantId === tenantFilter)
               }
               if (orgFilter.length) {
                  arr = arr.filter((f) => f.orgId === orgFilter)
               }
               if (projectFilter.length) {
                  arr = arr.filter((f) => f.projectId === projectFilter)
               }
               if (between && between.field && between.start && between.end) {
                  arr = arr.filter(
                     (f) =>
                        f[between.field] >= between.start &&
                        f[between.field] <= between.end
                  )
               }
               arr = sort.sortArray(arr, sortFields, orderBy)

               if (
                  arr.length &&
                  sortFields.length === 1 &&
                  sortFields[0] === 'name'
               ) {
                  if (arr[0].name && arr[0].name.split('-').length === 2) {
                     arr = arr.sort((a, b) => {
                        const atest = Number(a.name.split('-')[1])
                        const btest = Number(b.name.split('-')[1])
                        if (atest === btest) return 0
                        if (atest < btest) return -1
                        if (atest > btest) return 1
                     })
                  }
               }

               return arr
            },

         filtered: (state, getters) => {
            let arr = getters.sorted({})
            return sort.filterArray(arr, state.filterBy)
         },

         byTenant: (state, getters) => (id) => {
            let arr = getters.sorted({})
            return arr.filter((f) => f.tenantId === id)
         },

         byOrg: (state, getters) => (id) => {
            let arr = getters.sorted({})
            return arr.filter((f) => f.orgId === id)
         },

         byProject: (state, getters) => (id) => {
            let arr = getters.sorted({})
            return arr.filter((f) => f.projectId === id)
         },

         options:
            (state, getters) =>
            ({
               tenantId,
               orgId,
               statusFilter = [],
               roleFilter = [],
               titleField = 'name',
               sortFields = state.sortFields,
            }) => {
               let arr = getters.sorted({
                  statusFilter,
                  roleFilter,
                  sortFields,
               })
               if (tenantId) {
                  arr = arr.filter((f) => f.tenantId === tenantId)
               }
               if (orgId) {
                  arr = arr.filter((f) => f.orgId === orgId)
               }
               arr = arr.map((item) => {
                  return {
                     label: item[titleField],
                     value: item.id,
                     item: { ...item },
                  }
               })
               return arr
            },

         grouped: (state, getters) => {
            let arr = getters.filtered
            return sort.groupArray(arr, state.groupBy)
         },

         item: (state, getters) => (id) => {
            return getters.items.find((f) => f.id === id)
         },

         count: (state, getters) => {
            return state.counter || getters.items.length
         },

         nextValue: (state, getters) => (field, first) => {
            const arr = getters.sorted({
               sortFields: [field],
               orderBy: ['desc'],
            })
            if (arr.length && typeof arr[0][field] === 'number') {
               return arr[0][field]++
            }
            return Number(first)
         },

         output: (state) => () => {
            return state.output
         },
      }
   }

   return { state, mutations, getters }
}
