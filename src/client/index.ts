import './libs'

import * as Vue from 'vue'
import * as VueAuthenticate from 'vue-authenticate'
console.log(__assign);
var test = Vue.use(VueAuthenticate, {
  baseUrl: window.location.origin
});

import * as VueRouter from 'vue-router'
Vue.use(VueRouter);

import App from './app.vue'
import routes from 'routes.device'
import store from './store'
import * as vuexI18n from 'vuex-i18n'
Vue.use(vuexI18n.plugin, store);
import {en, ro} from '../common/dictionaries'
Vue.i18n.add('en', en);
Vue.i18n.add('ro', ro);
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
