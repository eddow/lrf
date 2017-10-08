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
- user + session + https://github.com/robinvdvleuten/vuex-persistedstate for express-session storage
- sécurité/API
- relevé d'activité (via socket.io?)
- favicon (fleur + rond)
- ajouter les frais de port
- trouver un thème semantic
*/

const app = express();

import * as session from 'express-session'
import * as MongoStore from 'connect-mongo'

app.use(session({
	secret: config.secret,
	store: new (MongoStore(session))({url: config.mongo.uri}),
	resave: true,
	saveUninitialized: true
}));

app.use(morgan('tiny'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
var server = require('http').createServer(app);
var io = require('socket.io')(server);
routes.statics(app, io.sockets);
import jsData from './controllers/js-data'
jsData(app, io.sockets, store);
routes.controllers(app, io.sockets, store);
console.log(`Listening on port ${config.server.port}`);
export default server.listen(config.server.port);
