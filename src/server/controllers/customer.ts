import {Router} from 'express'
import Dish, {Languages, Parts} from 'models/dish'
import Menu, {Categories} from 'models/menu'
import GroupCommand, {Command} from 'models/groupCommand'
import sendCommand from '../service/command'


export default function customer(store) {
	const customer = new Router();
	customer.route('/today').get(daily);
	customer.route('/week').get(weekly);
	customer.route('/week.html/:tpl').get(weekHtml);
	customer.route('/week.pdf/:tpl').get(weekPdf);
	customer.route('/').post(command);
	return customer;

	async function command(req, res) {
		var contact = req.body.contact;
		if(contact.group) {
			var groupCommand: GroupCommand = await store.find('groupCommand', contact.group);
			if(!groupCommand) res.status(404).send('Group not found');
			if(groupCommand.commands.find(c=> c.nickname === contact.name))
				res.status(409).send();
			else {
				groupCommand.commands.push(new Command({
					nickname: contact.name,
					items: req.body.products
				}));
				groupCommand.save({changesOnly: true}).then(
					()=> res.status(200).send(),
					(x)=> {
						console.error(x);
						res.status(500).send();
					}
				);
			}
		} else {
			try {
				await sendCommand(store, req.body.contact, req.body.products);
				res.status(200).send('ok');
			} catch(error) {
				res.status(500).send('bug');
				console.log(error);
			}
		}
	}
	function daily(req, res) {
		var day = ['', 'mon', 'tue', 'wed', 'thu', 'fri'][(new Date).getDay()]
		Promise.all([
			store.findAll('dish'),
			store.findAll('menu')
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
	//TODO: cache moi ça
	async function weekHtml(req, res) {
		try {
			var tpl = await template(req.params.tpl||'Semaine');
			if(tpl)
				res.send(generator.generate(tpl, await weekData()));
			else res.status(404).send(req.params.tpl);
		} catch(x) {
			console.error(x);
			res.status(500).send();
		}
	}
	async function weekPdf(req, res) {
		try {
			var tpl = await template(req.params.tpl||'Semaine');
			if(tpl) {
				var buffer = await pdfGen(generator.generate(tpl, await weekData()));
				res.write(buffer,'binary');
				res.end(null, 'binary');
			} else res.status(404).send(req.params.tpl);
		} catch(x) {
			console.error(x);
			res.status(500).send();
		}
	}
	async function weekly(req, res) {
		res.status(200).send(await weekData());
	}
	function template(name) {
		return store.findAll('template').then(tpls=> tpls.find(tpl=> tpl.name === name));
	}
	function weekData() {
		return Promise.all([
			store.findAll('dish'),
			store.findAll('menu')
		]).then(proms=> {
			var [dishes, menus] = proms, dbid = {}, mbid = {};
			for(let dish of dishes) {
				dbid[dish._id] = dish.toJSON();
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
			return {
				general: rv.shift(),
				week: rv
			};
		});
	}
}