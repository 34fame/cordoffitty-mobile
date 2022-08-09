import useCommon from './common'

const dataType = 'services'

export default function useService() {
   const common = useCommon()

   const load = async (tenantId) => {
      await common.load(dataType, tenantId)
   }

   const select = (id) => {
      common.select(dataType, id)
   }

   const loading = (value) => {
      common.loading(dataType, value)
   }

   const filterBy = (value) => {
      common.filterBy(dataType, value)
   }

   const groupBy = (value) => {
      common.groupBy(dataType, value)
   }

   const add = async (data) => {
      await common.add(dataType, data)
   }

   const update = async (data) => {
      await common.update(dataType, data)
   }

   const remove = async (id, tenantId) => {
      await common.remove(dataType, id, tenantId)
   }

   const copy = async (id, userId) => {
      await common.copy(dataType, id, userId)
   }

   return {
      load,
      select,
      loading,
      filterBy,
      groupBy,
      add,
      update,
      remove,
      copy,
   }
}
