import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'
import {Translated} from '../aux'

@Model()
export default class Template extends Record {
	@Required() name: string
	@Required() title: Translated
	@Required() dot: string
	@Required() css: string
	toString() { return this.name; }
}
