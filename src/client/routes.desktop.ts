import common from './routes.mobile'
import Dishes from './routes/dishes.vue'
import Menus from './routes/menus.vue'
import Templates from './routes/templates.vue'

export default [...common, {
	admin: true,
	menu: 'Plats',
	component: Dishes,
	path: '/dishes'
}, {
	admin: true,
	menu: 'Menus',
	component: Menus,
	path: '/menus'
}, {
	admin: true,
	menu: 'Templates',
	component: Templates,
	path: '/templates'
}];

import * as Vue from 'vue'
import vgl from 'vue-golden-layout'
Vue.use(vgl);