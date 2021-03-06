import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'
import {Categories} from '../auxs'

export {Categories}

@Model()
export default class Menu extends Record {
	@Enum(...Object.keys(Categories))
	@Required() identification: string
	@Items(String) dishes: string[]
}
