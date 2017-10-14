import * as nodemailer from 'nodemailer'
import {mailer, emails} from 'config'
import * as commandTpl from './command-mail.dot.txt'
import {dav} from 'common/libs/dot-gen'
import pdfGen from 'common/libs/pdf-gen'
import shipping from 'common/libs/shipping'
import * as dot from 'dot';
export const generator = new dav();

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
});

var transporter = nodemailer.createTransport(mailer);

export async function sendCommand(store, contact, products, commands = null) {
	function populate(products) {
		return products.map(p=> ({
			dish: dishes.find(d=> d._id === p.product),
			quantity: p.quantity
		}));
	}
	var dishes = await store.findAll('dish'), totalPrice;
	if(commands) {
		//debugger;
		for(let command of commands)
			command.items = populate(command.items);
		if(!products) {
			products = [];
			let partials = {};
			for(let command of commands) {
				for(let item of command.items)
					if(partials[item.dish._id])
						partials[item.dish._id].quantity += item.quantity;
					else
						partials[item.dish._id] = {...item};
			}
			products = Object.keys(partials).map(k=> partials[k]);
		} else products = populate(products);
	} else products = populate(products);
	totalPrice = products.reduce((sum, p)=> sum+p.quantity*p.dish.price, 0);
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
		contact,
		products,
		commands,
		totalPrice,
		shipping: shipping(totalPrice),
		toPay: shipping(totalPrice)+totalPrice
	})
	}, (error, info) => {
		if (error) throw error;
		console.log('Command message sent: %s', info.messageId);
		// Preview only available when sending through an Ethereal account
		if(process.env.NODE_ENV !== 'production')
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	});
}