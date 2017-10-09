import {HttpAdapter} from 'js-data-http'
import * as config from 'config'
import {store, initStore} from 'common/central'
import {Record, DataStore} from 'js-data'
import * as io from 'socket.io-client'
export * from './data'
import {observeDeeply} from './data'

initStore(new DataStore({
	mapperDefaults: {
		idAttribute: '_id'
	}
}));

store.on('all', function(event, name, param) {
	console.log('js-data', event);
	//Records are here observed by Vue. Without this, their properties are never observed
	if('add'=== event && param && param.length)
		observeDeeply(param, {
			type: 'array',
			items: store.getMapper(name).schema
		});
});
// patch js-data to have `changesOnly: true` by default.
const RecordSave = Record.prototype.save;
Record.prototype.save = function(opts?) {
	return RecordSave.call(this, {changesOnly: true, ...(opts||{})});
}

const httpAdapter = new HttpAdapter({
	basePath: window.location.origin+'/api'
});
store.registerAdapter('http', httpAdapter, { 'default': true });

var cachedCollections = {};
export function bindCollection(name) {
	if(!cachedCollections[name]) {
		cachedCollections[name] = store.getCollection(name);
		store.findAll(name);
	}
	return cachedCollections[name];
}

export const socket = io.connect(config.server.url);
socket.on('js-data', function(event, collection, item, data, ...args) {
	switch(event) {
		case 'update':
			var record = store.getCollection(collection).get(item);
			//We get the response from the server and commit server' changes to the local server
			//We should take care with this: the user might have changed some data and the request might have come slowly.
			// This is the place where we could have a "conflict" state in a value : changed differently on the server and locally
			console.assert(record, 'update event on a record that the client knos about');
			record.set(data);
			record.commit();
			break;
		case 'destroy':
			store.remove(collection, item);
			break;
		case 'create':
			store.add(collection, item);
			break;
		default:
			console.log('socket:', event, collection, item, data, ...args);
			break;
	}
});