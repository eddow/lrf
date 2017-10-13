import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'

export class CommandItem extends Record {
	@Required() product: string
	@Required() quantity: number
}
export class Command extends Record {
	@Required() @MinLength() nickname: string
	@Items(CommandItem) items: CommandItem[]
}
@Model()
export default class GroupCommand extends Record {
	@Required() @MinLength() name: string
	@Property() creationTime: number
	@Items(Command) commands: Command[]
}
