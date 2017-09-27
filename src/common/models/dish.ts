import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'


@Model()
export default class Translated {
	@Property() fr: string
	@Property() en: string
	@Property() ro: string
}
@Model()
export default class Dish extends Record {
	@Property() title: Translated
	@Property() description: Translated
	@Property() picture: string
}
