import {join} from 'path'
import {existsSync} from 'fs'
import * as express from 'express';
import auth from './controllers/auth'
import picture from './controllers/picture'
import customer from './controllers/customer'
import * as mobileDetect from 'mobile-detect'
import jsData from './controllers/js-data'
import opening from './controllers/opening'
import group from './controllers/group'

function device(req) {
	var md = new mobileDetect(req.headers['user-agent']);
	return md.mobile() || md.phone() || md.tablet() ? 'mobile' : 'client';
}
export function controllers(app, io, store, session) {
	//app.use(express.static('dist/client'));
	app.use(function(req, res, next) {
		var path = join(__dirname, '../dist', device(req)),
			fname = req.url.substr(1);
		if(1<fname.length && existsSync(join(path, fname)))
			res.sendFile(fname, {root: path});
		else next();
	});
	app.use(express.static('assets'));

	app.get('/themes/*', (req, res)=> {
		res.sendFile(req.params[0].split('?')[0], {
			root: join(__dirname, '../node_modules/semantic-ui/dist/themes/')
		});
	});

	opening(io, session);
	app.use('/api', jsData(io, session, store));
	app.use('/auth', auth);
	app.use('/picture', picture(store));
	app.use('/customer', customer(store));
	app.use('/group', group(store, io));
	//SPA: in last resort, just send `index.html` as the path is a client-side path
	app.use(function(req, res) {
		res.sendFile('index.html', {root: join(__dirname, '../dist', device(req))});
	});
}
