import groupCommand from 'models/groupCommand'
import {Router} from 'express'
import {sendCommand} from '../service/generate'
import GroupCommand, {Command, CommandItem} from 'models/groupCommand'
import * as schedule from 'node-schedule'

function clientCommand(dishes) {
	return (c: Command)=> {
		var price = 0;
		for(let item of c.items) {
			let dish = dishes.find(d=> d._id == item.product);
			if(!dish) throw new Error(`Inexistant dish in group command '${item.product}'`);
			price += dish.price;
		}
		return {
			nickname: c.nickname,
			price
		};
	}
}

export default function group(store, io) {
	schedule.scheduleJob('* 3 * * *', filterObsoletes);
	const groupns = io.of('/group');
	groupns.on('connection', function(socket) {
		socket.on('join', async group=> {
			var groupCommand: GroupCommand = await store.find('groupCommand', group);
			if(groupCommand && !groupCommand.sent) {
				socket.join(group);
				var dishes = await store.findAll('dish');
				socket.emit('commands', groupCommand.commands.map(clientCommand(dishes)));
			}
		});
		socket.on('leave', group=> {
			socket.leave(group);
		});
	});
	
	const group = new Router();
	
	group.put('/', createGroup).post('/', checkout).delete('/:group/:nickname', deleteSth)
		.get('/:id', findGroup).post('/:id', command);
	return group;
	
	async function command(req, res) {
		var contact = req.body.contact;
		var groupCommand: GroupCommand = await store.find('groupCommand', req.params.id);
		if(!groupCommand) res.status(404).send('Group not found');
		if(groupCommand.commands.find(c=> c.nickname === contact.name))
			res.status(409).send();
		else {
			groupCommand.commands.push(new Command({
				nickname: contact.name,
				items: req.body.products
			}));
			groupCommand.save({changesOnly: true}).then(
				async ()=> {
					res.status(200).send();
					groupns.to(groupCommand._id).emit('commands', groupCommand.commands.map(clientCommand(await store.findAll('dish'))));
				},
				(x)=> {
					console.error(x);
					res.status(500).send('bug');
				}
			);
		}
	}
	async function filterObsoletes(groups) {
		var groups = await store.findAll('groupCommand');
		var timestamp = (new Date()).getTime(),
			obsoletes = groups.filter(g=> timestamp > g.creationTime+1000*60*60*24);

		for(let obsolete of obsoletes)
			obsolete.destroy();
	}
	async function deleteSth(req, res) {
		var groupCommand = await store.find('groupCommand', req.params.group);
		if(!groupCommand) return res.status(404).send();
		if(req.params.nickname) {
			var cndx = groupCommand.commands.findIndex(c=> c.nickname == req.params.nickname);
			if(!~cndx) return res.status(404).send('nickname');
			groupCommand.commands.splice(cndx, 1);
			groupCommand.save({changesOnly: true}).then(
				async ()=> {
					res.status(200).send();
					groupns.to(groupCommand._id).emit('commands', groupCommand.commands.map(clientCommand(await store.findAll('dish'))));
				},
				err=> {
					console.error(err);
					res.status(500).send('bug')
				}
			);
		} else {
			return res.status(400).send();
			/*groupns.to(group._id).emit('ended');
			try { await group.destroy(); }
			catch(x) {
				console.log(x);
				res.status(500).send();
			}
			res.status(204).send();*/
		}
	}
	async function findGroup(req, res) {
		var group = await store.find('groupCommand', req.params.id);
		if(!group || group.sent) res.status(404).send();
		else res.status(200).send({
			name: group.name,
			id: group._id
		});
	}
	function createGroup(req, res) {
		var name = req.body.name;
		if(!name) return res.status(400).send();
		var group = new groupCommand({
			name,
			creationTime: (new Date()).getTime(),
			commands: []
		});
		group.save().then(
			item=> {
				res.status(200).send({name, id: item._id});
			},
			err=> {
				console.log(err);
				res.status(500).send('bug');
			}
		)
	}
	async function checkout(req, res) {
		var group = await store.find('groupCommand', req.body.group);
		
		try {
			await sendCommand(store, req.body.contact, null, group.commands);
			//deleteGroup(group, res);
			group.sent = true;
			group.save({changesOnly: true});
			groupns.to(group._id).emit('ended');
		} catch(error) {
			res.status(500).send('bug');
			console.log(error);
		}
	}
}