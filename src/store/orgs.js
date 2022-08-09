import useCommon from './common'

const common = useCommon()

const state = common.state()

const mutations = common.mutations()

const getters = common.getters()

export default {
   namespaced: true,
   getters,
   mutations,
   state,
}
