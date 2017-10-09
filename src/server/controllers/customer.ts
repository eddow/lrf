import {Router} from 'express'
import Dish, {Languages, Parts} from 'models/dish'
import Menu, {Categories} from 'models/menu'
import * as dot from 'dot'
import * as commandTpl from './command-mail.dot.txt'
import * as nodemailer from 'nodemailer'
import {mailer, emails} from 'config'

import {dav} from 'common/libs/dot-gen'
import pdfGen from 'common/libs/pdf-gen'
import * as jsonStringify from 'json-pretty'
var generator = new dav();

var commandMail = dot.template(commandTpl, {
	evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
	interpolate: /\{\{=([\s\S]+?)\}\}/g,
	encode:      /\{\{!([\s\S]+?)\}\}/g,
	use:         /\{\{#([\s\S]+?)\}\}/g,
	useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
	define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
	defineParams:/^\s*([\w$]+):([\s\S]+)/,
	conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
	iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
	varname:	"it",
	strip:		false,
	append:		true,
	selfcontained: false,
	doNotSkipEncoded: false
}), transporter = nodemailer.createTransport(mailer);

export default function customer(store) {
	const customer = new Router();
	customer.route('/today').get(daily);
	customer.route('/week').get(weekly);
	customer.route('/week.html/:tpl').get(weekHtml);
	customer.route('/week.pdf/:tpl').get(weekPdf);
	customer.route('/').post(command);
	return customer;

	function command(req, res) {
		store.findAll('dish').then(dishes=> {
			var products = req.body.products.map(p=> ({
				dish: dishes.find(d=> d._id === p.product),
				quantity: p.quantity
			})), totalPrice = products.reduce((sum, p)=> sum+p.quantity*p.dish.price, 0);
			var contact = req.body.contact;
			contact.language = {
				fr: 'Français',
				ro: 'Roumain',
				en: 'Anglais'
			}[contact.language];
			transporter.sendMail({
        from: emails.from,
        to: emails.seller,
        subject: `Nouvelle commande - ${totalPrice}`, // Subject line
        text: commandMail({
					contact: req.body.contact,
					products: products,
					totalPrice
				})
			}, (error, info) => {
				if (error) {
					res.status(500).send('bug');
					return console.log(error);
				}
				res.status(200).send('ok');
				console.log('Command message sent: %s', info.messageId);
				// Preview only available when sending through an Ethereal account
				console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
			});
		})
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