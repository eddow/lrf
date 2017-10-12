import {Router as jsDataRouter} from 'js-data-express';
import {Router as expressRouter} from 'express'
import {models} from 'common/central'
import {events as authEvents} from './auth'
import * as sharedsession from 'express-socket.io-session'

export default function jsData(io, session, store) {
	const jsData = new expressRouter();
	const jsdns = io.of('/js-data');
	jsdns.use(sharedsession(session, {
		autoSave:true
	}));
	const rqConfig = {
		request: (req, res, next) => {
			const user = req.session.user
			if (user && user.admin)
				next();
			else
				res.sendStatus(403);
		}
	};

	jsdns.on('connection', function(socket) {
		authEvents.on('logout', session=> {
			if(socket.handshake.session === session)
				socket.leave(Object.keys(socket.rooms));
		});
		socket.on('watch', collection=> {
			const user = socket.handshake.session.user;
			if (user && user.admin) {
				socket.join(collection);
			}
		});
		socket.on('unwatch', collection=> socket.leave(collection));
	});

	for(let model of models)	
		jsData.use('/'+model, new jsDataRouter(store.defineMapper(model), rqConfig).router)

	store.on('all', function(event, collection, id, data, ...args) {
		if(!/^before/.test(event)) {
			event = /^(?:after)?(.*)$/.exec(event)[1].toLowerCase();
			switch(event) {
				case 'update':
					jsdns.to(collection).emit(event, collection, id, data);
					break;
				case 'destroy':
				case 'create':
					jsdns.to(collection).emit(event, collection, id, data, ...args);
					break;
				default:
					break;
			}
		}
	});
	return jsData;
}