import common from './routes.mobile'

export default common;

import MenuContainer from './routes/container.vue'
common[0].children.push({
	admin: true,
	menu: 'Plats',
	component: ()=> import('./routes/dishes.vue'),
	path: 'dishes',
	name: 'dishes'
}, {
	admin: true,
	menu: 'Menus',
	component: ()=> import('./routes/menus.vue'),
	path: 'menus',
	name: 'menus'
}, {
	admin: true,
	menu: 'Templates',
	component: ()=> import('./routes/templates.vue'),
	path: 'templates',
	name: 'templates'
});

import * as Vue from 'vue'
import vgl from 'vue-golden-layout'
Vue.use(vgl);