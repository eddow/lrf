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
export const Categories = {
	entrance: 'Entrée',
	main: 'Plat principal',
	dessert: 'Dessert',
	daily: 'Du jour'
}
@Model()
class Translated {
	@Property() fr: string
	@Property() en: string
	@Property() ro: string
}
@Model()
export default class Dish extends Record {
	@Property() title: Translated
	@Property() description: Translated
	@Property() price: Number
	@Enum(...Object.keys(Categories)) Category: String
	@Property() picture: string
}
