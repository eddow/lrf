function mapper(cls, name) {
	cls.schema.properties._id = {
		type: 'string',
		enumerable: false,
		indexed: true	//used in Collection to create Index
	};
	return store.defineMapper(name, {
		schema: cls.schema,
		recordClass: cls
	});
}

import * as modelDefs from './models/*'
function nameFromPath(path) {
	return /([^/]*)\./.exec(path)[1];
}
export const models = Object.keys(modelDefs).map(m=>nameFromPath(m));

// Both client use this to register the store (http or mongo)
export function initStore(str) {
	store = str;
	for(let m in modelDefs)
	//We have to use file name as the function name is mangled when uglyfied
		mapper(modelDefs[m].default, nameFromPath(m));
}
export var store;
