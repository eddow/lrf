import Food from './routes/food.vue'
import Edit from './routes/edit.vue'

export default [{
	path: '/',
	menu: 'Menu',
	name: 'food',
	component: Food
}, {
	//admin: true,
	menu: 'Edit',
	component: Edit,
	path: '/edit'
}];