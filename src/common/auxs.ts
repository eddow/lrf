import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'

@Model()
export class Translated {
	@MinLength() @Required() fr: string
	@MinLength() @Required() en: string
	@MinLength() @Required() ro: string
}