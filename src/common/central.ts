import './extensions/*'

function mapper(cls, name) {
	cls.schema.properties._id = {
		type: 'string',
		enumerable: false,
		indexed: true	//used in Collection to create Index
	};
	return store.defineMapper(name[0].toUpperCase()+name.substr(1), {
		schema: cls.schema,
		recordClass: cls
	});
}

import * as models from './models/*'

// Both client use this to register the store (http or mongo)
export function initStore(str) {
	store = str;
	for(let m in models)
	//We have to use file name as the function name is mangled
		mapper(models[m].default, /([^/]*)\./.exec(m)[1]);
}
export var store;
