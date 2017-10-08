import {Router} from 'js-data-express';
import {models} from 'common/central'

export default function jsData(app, sockets, store) {
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
	for(let model of models)	
		app.use('/api/'+model, new Router(store.defineMapper(model), config).router)

	store.on('all', function(event, collection, id, data, ...args) {
		if(!/^before/.test(event)) {
			event = /^(?:after)?(.*)$/.exec(event)[1].toLowerCase();
			switch(event) {
				case 'update':
					sockets.emit('js-data', event, collection, id, data);
					break;
				case 'destroy':
				case 'create':
					sockets.emit('js-data', event, collection, id, data, ...args);
					break;
				default:
					break;
			}
		}
	});
}