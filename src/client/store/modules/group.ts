import * as alertify from 'alertify'
import {get, post, put} from 'axios'
import * as Vue from 'vue'

// initial state
// shape: [{ id, quantity }]
const state = {
  group: null
}

// getters
const getters = {
	commandGroup: state => !!state.group && state.group.name,
	groupLink: state => !!state.group && location.origin+'?group='+state.group.id
}

// actions
const actions = {
  joinGroup({commit, state}, group) {
		get('/group/'+group).then(
			response=> commit('joinGroup', response.data),
			err=> alertify.error(err)
		);
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
	},
	leaveGroup({commit}) {
		commit('groupCheckout');
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
