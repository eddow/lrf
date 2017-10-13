import groupCommand from 'models/groupCommand'
import {Router} from 'express'
import sendCommand from '../service/command'

export default function group(store, io) {
	
	const groupns = io.of('/group');
	groupns.on('connection', function(socket) {
		socket.on('join', group=> {
			socket.join(group);
		});
		socket.on('leave', group=> socket.leave(group));
	});
	
	const group = new Router();
	
	group.put('/', createGroup).post('/', checkout).delete('/', abortGroup)
		.get('/:id', findGroup);
	return group;
	
	async function filterObsoletes(groups) {
		var groups = await store.findAll('groupCommand');
		var timestamp = (new Date()).getTime(),
			obsoletes = groups.filter(g=> timestamp > g.creationTime+1000*60*60*24);

		for(let obsolete of obsoletes)
			obsolete.destroy();
	}
	async function deleteGroup(group, res) {
		if(!group) return res.status(404).send();
		try { await group.destroy(); }
		catch(x) {
			console.log(x);
			res.status(500).send();
		}
		res.status(204).send();
	}
	async function abortGroup(req, res) {
		deleteGroup(await store.find('groupCommand', req.body.group), res);
	}
	async function findGroup(req, res) {
		var group = await store.find('groupCommand', req.params.id);
		if(!group) res.status(404).send();
		res.status(200).send({
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
				res.status(500).send('oops');
			}
		)
	}
	async function checkout(req, res) {
		var group = await store.find('groupCommand', req.body.group);
		
		try {
			await sendCommand(store, req.body.contact, null, group.commands);
			deleteGroup(group, res);
		} catch(error) {
			res.status(500).send('bug');
			console.log(error);
		}
	}
}