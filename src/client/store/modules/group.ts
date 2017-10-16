import * as alertify from 'alertify'
import {get, post, put, delete as del} from 'axios'
import * as Vue from 'vue'
import * as io from 'socket.io-client'

const socket = io('/group');

//TODO: join on-load

// initial state
// shape: [{ id, quantity }]
const state = {
	group: null,
	socket: null,
	events: {},
	commands: []
};

// getters
const getters = {
	commandGroup: state => !!state.group && state.group.name,
	groupLink: state => !!state.group && location.origin+'?group='+state.group.id,
	commands: state=> state.commands
};

// actions
const actions = {
  joinGroup({commit, state}, group) {
		get('/group/'+(group||state.group.id)).then(
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
	groupCheckout({commit, state}, infos) {
		var savedGroup = state.group;
		commit('groupCheckout');
		post('/group', {
			group: savedGroup.id,
			contact: infos
		}).then(
      () => commit('groupCheckoutSuccess'),
      () => commit('groupCheckoutFailure', {savedGroup})
    );
	},
	leaveGroup({commit}) {
		commit('groupCheckout');
	},
	/*deleteGroup({commit, state}) {
		del('/group', {
			group: state.group.id
		}).then(
      () => commit('groupCheckout')
    );
	},*/
	deleteCommand({commit, state}, nickname) {
		del('/group/'+state.group.id+'/'+nickname);
	}
}
const socketEvents = {
	commands(value) {
		this.commit('commandsChanged', value);
	},
	ended(value) {
		this.commit('groupCheckout');
	}
};
function socketOff(stateEvents) {
	for(let i of Object.keys(stateEvents)) {
		socket.off(i, stateEvents[i]);
		delete stateEvents[i];
	}
}
// mutations
const mutations = {
  joinGroup(state, group) {
		state.group = group;
		socketOff(state.events);
		for(let i in socketEvents)
			socket.on(i, state.events[i] = socketEvents[i].bind(this));
		socket.emit('join', group.id);
  },
  groupCheckout(state) {
		socket.emit('leave', state.group.id);
		socketOff(state.events);
		state.group = null;
  },
	commandsChanged(state, commands) {
		state.commands = commands;
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
