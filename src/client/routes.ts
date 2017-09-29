import Food from './routes/food.vue'
import Dishes from './routes/dishes.vue'
import Menus from './routes/menus.vue'
import Templates from './routes/templates.vue'

export default [{
	path: '/',
	menu: 'Menu',
	name: 'food',
	component: Food
}, {
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