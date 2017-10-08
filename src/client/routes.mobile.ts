import Food from './routes/food.vue'
import Cart from './routes/cart.vue'

const MenuContainer = {
  template: `<router-view></router-view>`
}

export default [{
	path: '/:lang',
	component: MenuContainer,
	children: [{
		path: '',
		menu: 'Menu du jour',
		name: 'food',
		component: Food
	}, {
		path: 'cart',
		menu: 'Panier',
		name: 'cart',
		component: Cart
	}]
}];