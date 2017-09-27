import {join} from 'path'
import * as express from 'express';
import auth from './controllers/auth'

export function statics(app, sockets) {
	app.use(express.static('dist/client'));
	app.use(express.static('assets'));

	app.get('/themes/*', (req, res)=> {
		res.sendFile(req.params[0].split('?')[0], {
			root: join(__dirname, '../node_modules/semantic-ui/dist/themes/')
		});
	});
	app.use('/auth', auth);
}

export function controllers(app, sockets) {
	
	//SPA: in last resort, just send `index.html` as the path is a client-side path
	app.use(function(req, res) {
		res.sendFile('index.html', {root: join(__dirname, '../dist/client')});
	});
}
