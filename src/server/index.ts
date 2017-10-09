import 'ts-json-schema-decorator'
import * as express from 'express';
import {MongoDBAdapter} from 'js-data-mongodb';
import * as config from 'config'
import {store, initStore} from 'common/central'
import {Container} from 'js-data'
import * as routes from './routes'
import * as io from 'socket.io'
import * as bodyParser from 'body-parser'
import * as morgan from 'morgan'

initStore(new Container({
	mapperDefaults: {
		idAttribute: '_id'
	}
}));
// Create an instance of MongoDBAdapter : change this line to use another adapter
store.registerAdapter('mongodb', new MongoDBAdapter(config.mongo), { 'default': true });
/*TODO:
- heures d'ouverture
- user mgt (name, admin, token) + https://github.com/robinvdvleuten/vuex-persistedstate for express-session storage
- relevé d'activité (via socket.io?)
- favicon (lys + rond)
- ajouter les frais de port
- `position:fixed` foire pour le menu
*/

const app = express();

import * as session from 'express-session'
import * as MongoStore from 'connect-mongo'

const mongoSession = session({
	secret: config.secret,
	store: new (MongoStore(session))({
		url: config.mongo.uri,
		ttl: 4 * 60 * 60	//4h
	}),
	resave: true,
	saveUninitialized: true
});
app.use(mongoSession);

app.use(morgan('tiny'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
var server = require('http').createServer(app);
var sharedsession = require("express-socket.io-session");
var io = require('socket.io')(server);

io.use(sharedsession(mongoSession, {
	autoSave:true
}));

io.on('connection', function(socket){
  console.log('connection');
	socket.on('language', function(lng) {
		//https://www.npmjs.com/package/express-socket.io-session
		/*
        socket.handshake.session.language = lng;
        socket.handshake.session.save();
		*/
	});
});

routes.statics(app, io.sockets);
import jsData from './controllers/js-data'
jsData(app, io.sockets, store);
routes.controllers(app, io.sockets, store);
console.log(`Listening on port ${config.server.port}`);
export default server.listen(config.server.port);
