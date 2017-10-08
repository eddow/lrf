import common from './routes.mobile'
import Dishes from './routes/dishes.vue'
import Menus from './routes/menus.vue'
import Templates from './routes/templates.vue'

export default common;
common[0].children.push( {
	admin: true,
	menu: 'Plats',
	component: Dishes,
	path: 'dishes',
	name: 'dishes'
}, {
	admin: true,
	menu: 'Menus',
	component: Menus,
	path: 'menus',
	name: 'menus'
}, {
	admin: true,
	menu: 'Templates',
	component: Templates,
	path: 'templates',
	name: 'templates'
});

import * as Vue from 'vue'
import vgl from 'vue-golden-layout'
Vue.use(vgl);