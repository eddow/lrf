import {Router} from 'express'
import Dish, {Languages, Parts} from 'models/dish'
import Menu, {Categories} from 'models/menu'

export default function customer(store) {
	const customer = new Router();
	customer.route('/menu')
		.get(mainMenu);
	return customer;

	function mainMenu(req, res) {
		var day = ['', 'mon', 'tue', 'wed', 'thu', 'fri'][(new Date).getDay()]
		Promise.all([
			store.findAll('Dish'),
			store.findAll('Menu')
		]).then(proms=> {
			function menuDishes(identification) {
				var menu = menus.find(m=> m.identification === identification);
				return menu ? menu.dishes : [];
			}
			var [dishes, menus] = proms, dbid = {}, mbid = {},
				general = menuDishes('all'), daily = menuDishes(day);
			for(let dish of dishes) {
				dbid[dish._id] = dish.toJSON();
				dbid[dish._id].picture = !!dbid[dish._id].picture;
			}
			var rv = [], allDishes = general.map(did=> dbid[did]).concat(daily.map(did=> __assign(dbid[did], {today: true})));
			for(let part in Parts) {
				rv.push({
					title: Parts[part],	//translate here
					dishes: allDishes.filter(d=> d.part === part)
				});
			}
			res.status(200).send(rv);
		});
	}
}