import groupCommand from 'models/groupCommand'
import {Router} from 'express'

export default function group(store, io) {
	
	const groupns = io.of('/group');
	groupns.on('connection', function(socket) {
		socket.on('join', group=> {
			socket.join(group);
		});
		socket.on('leave', group=> socket.leave(group));
	});
	
	const group = new Router();
	
	group.put('/', createGroup).post('/', checkout)
		.get('/:id', findGroup);
	return group;
	
	async function filterObsoletes(groups) {
		var groups = await store.findAll('groupCommand');
		var timestamp = (new Date()).getTime(),
			obsoletes = groups.filter(g=> timestamp > g.creationTime+1000*60*60*24);

		for(let obsolete of obsoletes)
			obsolete.destroy();
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
	function checkout(req, res) {
		
	}
}