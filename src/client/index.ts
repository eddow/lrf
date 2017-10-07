import './libs'

import * as Vue from 'vue'
import * as VueAuthenticate from 'vue-authenticate'

var test = Vue.use(VueAuthenticate, {
  baseUrl: window.location.origin
});

import * as VueRouter from 'vue-router'
Vue.use(VueRouter);

import * as components from './components/*.vue'
for(let c in components) {
	let component = components[c].default;
	Vue.component(component.options.name, component);
}

import App from './app.vue'
import routes from 'routes.device'
import store from './store'
var router = new VueRouter({
	mode: window.history && window.history.pushState?'history':'hash',
	routes
}),
root = new Vue({
	router,
	store,
	el: 'app',
	components: {App}
});
