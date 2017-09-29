import {Router} from 'express'
import Dish, {Languages, Parts} from 'models/dish'
import Menu, {Categories} from 'models/menu'

export default function customer(store) {
	const customer = new Router();
	customer.route('/today').get(daily);
	customer.route('/week').get(weekly);
	return customer;

	function daily(req, res) {
		var day = ['', 'mon', 'tue', 'wed', 'thu', 'fri'][(new Date).getDay()]
		Promise.all([
			store.findAll('Dish'),
			store.findAll('Menu')
		]).then(proms=> {
			function menuDishes(identification) {
				var menu = menus.find(m=> m.identification === identification);
				return menu ? menu.dishes : [];
			}
			var [dishes, menus] = proms, dbid = {},
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
	function weekly(req, res) {
		Promise.all([
			store.findAll('Dish'),
			store.findAll('Menu')
		]).then(proms=> {
			var [dishes, menus] = proms, dbid = {}, mbid = {};
			for(let dish of dishes) {
				dbid[dish._id] = dish.toJSON();
				//dbid[dish._id].picture = !!dbid[dish._id].picture;
			}
			for(let menu of menus) {
				menu = mbid[menu.identification] = menu.toJSON();
				let mdishes = menu.dishes.map(x=> dbid[x]);
				delete menu.dishes;
				menu.parts = [];
				for(let part in Parts) {
					let dishes = mdishes.filter(d=> d.part === part);
					if(dishes && dishes.length)
						menu.parts.push({
							title: Parts[part],	//translate here
							dishes
						});
				}
			}
			var rv = [];
			for(let category in Categories) {
				let parts = mbid[category] && mbid[category].parts;
				if(parts && parts.length)
					rv.push({
						category: Categories[category],	//translate here
						parts
					});
			}
			res.status(200).send(rv);
		});
	}
}