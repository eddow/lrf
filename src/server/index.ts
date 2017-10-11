import 'ts-json-schema-decorator'
import * as express from 'express';
import {MongoDBAdapter} from 'js-data-mongodb';
import * as config from 'config'
import {store, initStore} from 'common/central'
import {Container} from 'js-data'
import * as routes from './routes'
import * as bodyParser from 'body-parser'
import * as morgan from 'morgan'
import {readFileSync} from 'fs'

initStore(new Container({
	mapperDefaults: {
		idAttribute: '_id'
	}
}));
// Create an instance of MongoDBAdapter : change this line to use another adapter
store.registerAdapter('mongodb', new MongoDBAdapter(config.mongo), { 'default': true });
/*TODO:
- automatiser heures d'ouverture
- user mgt (name, admin, token) + https://github.com/robinvdvleuten/vuex-persistedstate for express-session storage
- relevé d'activité (via socket.io?)
- favicon (lys + rond)
- ajouter les frais de port
- `position:fixed` foire pour le menu sur android/chrome
- Menu langue vertical?
- -> https
*/
import * as http from 'http'
import * as https from 'https'
var credentials = null;
if(config.https)
	credentials = {
		key: readFileSync(config.https+'.key', 'utf8'),
		cert: readFileSync(config.https+'.cert', 'utf8')
	};
//https://stackoverflow.com/questions/11744975/enabling-https-on-express-js
const app = express();
console.log('Creating http'+(credentials?'s':'')+' server');
var server = credentials ? https.createServer(credentials, app) : http.createServer(app);

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

//import * as sharedsession from 'express-socket.io-session'
var io = require('socket.io')(server);
/*io.of('/').use(sharedsession(mongoSession, {
	autoSave:true
}));*/

/*io.on('connection', function(socket){
  console.log('connection');
});*/

routes.statics(app, io);
import jsData from './controllers/js-data'
jsData(app, io, mongoSession, store);
import opening from './controllers/opening'
opening(app, io, mongoSession);
routes.controllers(app, io, store);
const listener = server.listen(
	process.env.PORT || config.server.port,
	function() {
		console.log('Listening on port ' + listener.address().port);
	});
export default listener;
