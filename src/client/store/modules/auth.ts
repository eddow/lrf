import * as Vue from 'vue'
import {VueAuthenticate} from 'vue-authenticate'

const vueAuthInstance = Vue.prototype.$auth;
function refreshContext(context) {
	context.commit('identify', {
		profile: vueAuthInstance.isAuthenticated() ? vueAuthInstance.getPayload() : null
	});
}

export default {
  state: {
    profile: null
  },

  mutations: {
    identify(state, payload) {
      state.profile = payload.profile
    }
  },

  actions: {
    login(context, payload) {
      payload = payload || {}
      return vueAuthInstance.login(payload.user, payload.requestOptions).then(function () {
				refreshContext(context);
      })
    },

    register(context, payload) {
      payload = payload || {}
      return vueAuthInstance.register(payload.user, payload.requestOptions).then(function () {
				refreshContext(context);
      })
    },

    logout(context, payload) {
      payload = payload || {}
      return vueAuthInstance.logout(payload.requestOptions).then(function () {
				refreshContext(context);
      })
    },

    authenticate(context, payload) {
      payload = payload || {}
      return vueAuthInstance.authenticate(payload.provider, payload.userData, payload.requestOptions).then(function () {
				refreshContext(context);
      })
    }
  }
}
