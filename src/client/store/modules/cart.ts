import * as alertify from 'alertify'
import {post} from 'axios'
import * as Vue from 'vue'

// initial state
// shape: [{ id, quantity }]
const state = {
  added: []
}

// actions
const actions = {
  checkout({commit, state}, infos) {
    const savedCartItems = [...state.added];
		commit('checkoutRequest');
		post('/customer', {
			products: savedCartItems,
			contact: infos
		}).then(
      () => commit('checkoutSuccess'),
      () => commit('checkoutFailure', {savedCartItems})
    );
  },
  emptyCart({commit, state}) {
    commit('checkoutRequest');
	},
	addToCart({commit}, description) {
		commit('addToCart', description);
	}
}

// mutations
const mutations = {
  addToCart(state, {product, quantity, add}) {
    state.lastCheckout = null
		const record = state.added.find(p => p.product === product);
		if(false!== quantity) {
			if (!record)
				state.added.push({
					product,
					quantity
				})
			else if(add)
				record.quantity += quantity;
			else
				record.quantity = quantity;
		} else if(record)
			state.added.splice(state.added.findIndex(p => p.product === product), 1);
  },

  checkoutRequest(state) {
    // clear cart
    state.added = []
  },

  checkoutSuccess(state) {
		alertify.success(Vue.prototype.$t('La commande a été transmise...'));
  },

  checkoutFailure(state, {savedCartItems}) {
    // rollback to the cart saved before sending the request
    state.added = savedCartItems;
		alertify.error(Vue.prototype.$t('Un problème est apparu. Veuillez ré-essayer plus tard.'));
  }
}

export default {
  state,
  //getters,
  actions,
  mutations
}
