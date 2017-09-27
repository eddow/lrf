import {Store} from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import cart from './modules/cart'
import products from './modules/products'
import * as createLogger from 'vuex/dist/logger'

const debug = true;//process.env.NODE_ENV !== 'production'

export default new Store({
  actions,
  getters,
  modules: {
		cart,
		products
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
