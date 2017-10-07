import {buyProducts} from 'biz/shop'
import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  added: [],
  checkoutStatus: null
}

// getters
const getters = {
  checkoutStatus: state => state.checkoutStatus
}

// actions
const actions = {
  checkout ({ commit, state }, infos) {
    const savedCartItems = [...state.added];
    commit(types.CHECKOUT_REQUEST);
    buyProducts(
			savedCartItems,
      infos, 
      () => commit(types.CHECKOUT_SUCCESS),
      () => commit(types.CHECKOUT_FAILURE, { savedCartItems })
    );
  },
  emptyCart ({ commit, state }) {
    commit(types.CHECKOUT_REQUEST);
  }
}

// mutations
const mutations = {
  [types.ADD_TO_CART] (state, {product, quantity}) {
    state.lastCheckout = null
		const record = state.added.find(p => p.product === product);
		if(false!== quantity) {
			if (!record)
				state.added.push({
					product,
					quantity
				})
			else
				record.quantity = quantity;
		} else if(record)
			state.added.splice(state.added.findIndex(p => p.product === product), 1);
  },

  [types.CHECKOUT_REQUEST] (state) {
    // clear cart
    state.added = []
    state.checkoutStatus = null
  },

  [types.CHECKOUT_SUCCESS] (state) {
    state.checkoutStatus = 'successful'
  },

  [types.CHECKOUT_FAILURE] (state, { savedCartItems }) {
    // rollback to the cart saved before sending the request
    state.added = savedCartItems
    state.checkoutStatus = 'failed'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
