import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface BotStatusTable extends AuditedEntity {
  name: string;
  display_on_dashboard?: boolean;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotStatus = Selectable<BotStatusTable>
export type NewBotStatus = Insertable<BotStatusTable>
export type BotStatusUpdate = Updateable<BotStatusTable>
