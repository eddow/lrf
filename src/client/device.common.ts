import MenuContainer from './routes/container.vue'

export var routes = [{
	path: '/',
	component: MenuContainer,
	children: [{
		path: '',
		name: 'food',
		component: ()=> import('./routes/food.vue')
	}, {
		path: 'cart',
		name: 'cart',
		component: ()=> import('./routes/cart.vue')
	}, {
		path: 'week',
		name: 'week',
		component: ()=> import('./routes/week.vue')
	}, {
		path: 'contact',
		name: 'contact',
		component: ()=> import('./routes/contact.vue')
	}]
}];