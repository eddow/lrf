import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'

export const Categories = {
	all: 'Général',
	mon: 'Lundi',
	tue: 'Mardi',
	wed: 'Mercredi',
	thu: 'Jeudi',
	fri: 'Vendredi'
}

@Model()
export default class Menu extends Record {
	@Property() identification: string	//either a category keyword, either a date
	@Items(String) dishes: string[]
}
