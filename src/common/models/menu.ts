import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'

export const Categories = {
	entrance: 'Entrée',
	main: 'Plat principal',
	dessert: 'Dessert',
	chicken: 'Poulet'
}

@Model()
export default class Menu extends Record {
	@Property() identification: string	//either a category keyword, either a date
	@Items(String) dishes: string[]
}
