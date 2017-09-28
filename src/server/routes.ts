import {join} from 'path'
import * as express from 'express';
import auth from './controllers/auth'
//import picture from './controllers/picture'

export function statics(app, sockets) {
	app.use(express.static('dist/client'));
	app.use(express.static('assets'));

	app.get('/themes/*', (req, res)=> {
		res.sendFile(req.params[0].split('?')[0], {
			root: join(__dirname, '../node_modules/semantic-ui/dist/themes/')
		});
	});
}

export function controllers(app, sockets, store) {
	app.use('/auth', auth);
	//app.use('/picture', picture(store));
	//SPA: in last resort, just send `index.html` as the path is a client-side path
	app.use(function(req, res) {
		res.sendFile('index.html', {root: join(__dirname, '../dist/client')});
	});
}
