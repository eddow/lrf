import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'

@Model()
export default class log extends Record {
	@Property() sessionId: string
	@Property() timestamp: number
	@Property() action: string
	@Property() infos: any
}
