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

import store from './store'
import * as vuexI18n from 'vuex-i18n'
Vue.use(vuexI18n.plugin, store);
import {en, ro, fr} from '../common/dictionaries'
Vue.i18n.add('en', en);
Vue.i18n.add('ro', ro);
Vue.i18n.add('fr', fr);

import {CookieStorage} from 'cookie-storage'
__assign(Vue.prototype, {
	cookies: new CookieStorage(),
	/*cookies: new Proxy({}, {
		has(target, prop) {
			return !!cookies.getItem(prop);
		},
		get(target, prop) {
			var cookie = cookies.getItem(prop);
			try {
				return cookie?JSON.parse(cookie):undefined;
			} catch(x) {
				console.error('cookie parse error: ', x)
				return;
			}
		},
		set(target, prop, value) {
			return cookies.setItem(prop, JSON.stringify(value));
		},
		deleteProperty(target, prop) {
			return cookies.removeItem(prop);
		},
		ownKeys(target) {
			var i, rv = [];
			for(i=0; i<cookies.length; ++i)
				rv.push(cookies.key(i));
			return rv;
		}
	}),*/
	$lei(number) {
		return number.toFixed(2)+' le'+(1<=number && 2>number?'u':'i');
	}
});
import App from './app.vue'
var router = new VueRouter({
	mode: window.history && window.history.pushState?'history':'hash',
	routes
}),
root = new App({
	router,
	store,
	el: 'app'
});
