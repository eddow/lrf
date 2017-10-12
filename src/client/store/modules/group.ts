import * as alertify from 'alertify'
import {post, put} from 'axios'
import * as Vue from 'vue'

// initial state
// shape: [{ id, quantity }]
const state = {
  group: null
}

// getters
const getters = {
  inGroup: state => !!state.group
}

// actions
const actions = {
  joinGroup({commit, state}, group) {
		commit('joinGroup', group);
  },
  createGroup({commit, state}, name) {
		put('/group', {
			name
		}).then(
      (response) => commit('joinGroup', response.data),
      () => alertify.error(Vue.prototype.$t('Un problème est apparu. Veuillez ré-essayer plus tard.'))
    );
  },
	groupCheckout({commit}) {
		var savedGroup = state.group;
		commit('groupCheckout');
		post('/group', {
			group: savedGroup
		}).then(
      () => commit('groupCheckoutSuccess'),
      () => commit('groupCheckoutFailure', {savedGroup})
    );
	}
}

// mutations
const mutations = {
  joinGroup(state, group) {
		state.group = group;
  },
  groupCheckout(state) {
		state.group = null;
  },

  groupCheckoutSuccess(state) {
		alertify.success(Vue.prototype.$t('La commande a été transmise...'));
  },

  groupCheckoutFailure(state, {savedGroup}) {
    // rollback to the cart saved before sending the request
    state.group = savedGroup;
		alertify.error(Vue.prototype.$t('Un problème est apparu. Veuillez ré-essayer plus tard.'));
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
