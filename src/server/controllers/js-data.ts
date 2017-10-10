import {Router} from 'js-data-express';
import {models} from 'common/central'
import {events as authEvents} from './auth'

export default function jsData(app, io, store) {
		/*mount(app, store, '/api', {
		request(req, res, next) {
			console.log('api request');
			next();
		}
	});*/
	const config = {
		/* http://www.js-data.io/docs/js-data-express
  // find, findAll, create, createMany, etc.
  'destroy': {
    request: (req, res, next) => {
      const userIsAdmin = req.session.isAdmin

      if (userIsAdmin) {
        next() 
      } else {
        res.sendStatus(401)
      }
	}
	*/
		request: (req, res, next) => {
			const user = req.session.user
			console.log(req.session);
			if (user && user.admin)
				next() ;
			else
				res.sendStatus(403);
		}
	};

	io.of('/js-data').on('connection', function(socket) {
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
		app.use('/api/'+model, new Router(store.defineMapper(model), config).router)

	store.on('all', function(event, collection, id, data, ...args) {
		if(!/^before/.test(event)) {
			event = /^(?:after)?(.*)$/.exec(event)[1].toLowerCase();
			switch(event) {
				case 'update':
					io.of('/js-data').to(collection).emit(event, collection, id, data);
					break;
				case 'destroy':
				case 'create':
					io.of('/js-data').to(collection).emit(event, collection, id, data, ...args);
					break;
				default:
					break;
			}
		}
	});
}