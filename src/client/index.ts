import './libs'
import {routes} from 'device.dependant'

import * as Vue from 'vue'
import * as VueAuthenticate from 'vue-authenticate'
console.log(__assign);
var test = Vue.use(VueAuthenticate, {
	baseUrl: window.location.origin,
	logoutUrl: '/auth/logout',
  providers: {
    github: {
      clientId: '6147f5d39757630966f7'
    }
  }
});

import * as VueRouter from 'vue-router'
Vue.use(VueRouter);

import * as io from 'socket.io-client'
io.connect(location.origin);

import store from './store'
import * as vuexI18n from 'vuex-i18n'
Vue.use(vuexI18n.plugin, store);
import * as vuexI18n from 'vuex-i18n'
Vue.use(vuexI18n.plugin, store);
import {en, ro} from '../common/dictionaries'
Vue.i18n.add('en', en);
Vue.i18n.add('ro', ro);

import {CookieStorage} from 'cookie-storage'
Vue.prototype.cookies = new CookieStorage();
import App from './app.vue'
var router = new VueRouter({
	mode: window.history && window.history.pushState?'history':'hash',
	routes
}),
root = new App({
	router,
	store,
	el: 'app'/*,
	components: {App}*/
});
