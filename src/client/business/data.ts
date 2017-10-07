import * as Vue from 'vue'

export function observeDeeply(obj, schema?) {
	//TODO: schema $refs
	var list = (!schema || 'array'=== schema.type)? obj :
		'object'=== schema.type? schema.properties :
		null;
	if(list) for(let i in list) {
		if(obj[i] && 'object'=== typeof obj[i])
			observeDeeply(obj[i], schema && (
				'object'=== schema.type ? schema.properties[i] :
				'array'=== schema.type ? schema.items :
				null
			));
			Vue.util.defineReactive(obj, i, obj[i]);
	}
	return obj;
}