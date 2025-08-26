import { state } from './point/state'
import { getters } from './point/getters'
import { actions } from './point/actions'
import { mutations } from './point/mutations'

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
