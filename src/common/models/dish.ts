import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'

export const Languages = {
	fr: 'Français',
	en: 'Anglais',
	ro: 'Roumain'
};
@Model()
class Translated {
	@MinLength() @Required() fr: string
	@MinLength() @Required() en: string
	@MinLength() @Required() ro: string
}
@Model()
export default class Dish extends Record {
	@Required() title: Translated
	@Required() description: Translated
	@Required() price: number
	@Required() picture: string
}
