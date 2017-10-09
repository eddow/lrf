import MenuContainer from './routes/container.vue'

export var routes = [{
	path: '/',
	component: MenuContainer,
	children: [{
		path: '',
		menu: 'Menu du jour',
		name: 'food',
		component: ()=> import('./routes/food.vue')
	}, {
		path: 'cart',
		menu: 'Panier',
		name: 'cart',
		component: ()=> import('./routes/cart.vue')
	}, {
		path: 'week',
		menu: 'Semaine',
		name: 'week',
		component: ()=> import('./routes/week.vue')
	}]
}];