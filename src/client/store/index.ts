import {Store} from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import auth from './modules/auth'
import cart from './modules/cart'
import group from './modules/group'
import * as createPersistedState from 'vuex-persistedstate'
import * as createLogger from 'vuex/dist/logger'

const debug = true;//process.env.NODE_ENV !== 'production'

export default new Store({
  actions,
  getters,
  modules: {
		auth,
		cart,
		group
  },
  strict: debug,
  plugins: (debug ? [createLogger()] : []).concat([createPersistedState()])
})
