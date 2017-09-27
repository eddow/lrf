import Food from './routes/food.vue'
import Register1 from './routes/register1.vue'
import RegisterRex from './routes/registerRex.vue'
import Upload from './routes/upload.vue'

const MenuContainer = {
  template: `<router-view></router-view>`
}

export default [{
	path: '/',
	menu: 'Menu',
	name: 'food',
	component: Food
}];