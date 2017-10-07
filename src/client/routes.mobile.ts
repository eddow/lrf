import Food from './routes/food.vue'
import Cart from './routes/cart.vue'

export default [{
	path: '/',
	menu: 'Menu du jour',
	name: 'food',
	component: Food
}, {
	path: '/cart',
	menu: 'Panier',
	name: 'cart',
	component: Cart
}];