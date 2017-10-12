import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'

class CommandItem extends Record {
	@Required() dish: string
	@Required() number: number
}
class Command extends Record {
	@Required() @MinLength() nickname: string
	@Items(CommandItem) items: CommandItem[]
}
@Model()
export default class GroupCommand extends Record {
	@Required() @MinLength() name: string
	@Items(Command) commands: Command[]
}
