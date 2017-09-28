import {Router} from 'express'
import Dish, {Languages} from 'models/dish'
import Menu, {Categories} from 'models/menu'

export default function customer(store) {
	const customer = new Router();

	customer.route('/menu')
		.get(mainMenu);
	return customer;

	function mainMenu(req, res) {
		Promise.all([
			store.findAll('Dish'),
			store.findAll('Menu')
		]).then(proms=> {
			var [dishes, menus] = proms, dbid = {}, mbid = {};
			for(let dish of dishes) {
				dbid[dish._id] = dish.toJSON();
				dbid[dish._id].picture = !!dbid[dish._id].picture;
			}
			for(let menu of menus) {
				let mw = mbid[menu.identification] = menu.toJSON();
				mw.dishObjs = mw.dishes.map(did=> dbid[did]);
			}
			var rv = [];
			for(let ccode in Categories) {
				rv.push({
					title: Categories[ccode],	//translate here
					dishes: mbid[ccode].dishObjs
				});
			}
			res.status(200).send(rv);
		});
	}
}