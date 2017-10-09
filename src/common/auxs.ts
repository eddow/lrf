import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'

export const Languages = {
	ro: {
		self: 'Românesc',
		flag: 'ro'
	},
	fr: {
		self: 'Français',
		flag: 'fr'
	},
	en: {
		self: 'English',
		flag: 'gb'
	}
};

export const Categories = {
	all: 'Cette semaine',
	mon: 'Lundi',
	tue: 'Mardi',
	wed: 'Mercredi',
	thu: 'Jeudi',
	fri: 'Vendredi'
}
@Model()
export class Translated {
	@Required() fr: string
	@Required() en: string
	@Required() ro: string
}