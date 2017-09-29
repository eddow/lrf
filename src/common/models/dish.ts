import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'
import {Translated} from '../aux'

export const Languages = {
	ro: 'Roumain',
	fr: 'Français',
	en: 'Anglais'
};

export const Parts = {
	entrance: 'Entrée',
	main: 'Plat principal',
	roast: 'Rôtisserie',
	side: 'Accompagnement',
	dessert: 'Dessert'
}

@Model()
export default class Dish extends Record {
	@Enum('', ...Object.keys(Parts))
	@Required() part: string
	@Required() title: Translated
	@Required() description: Translated
	@Required() price: number
	@Required() grams: number
	@Required() picture: string

	toString() { return this.title.fr; }
}
