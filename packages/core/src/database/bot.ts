import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";


export interface BotTable extends AuditedEntity {
  bot_uuid: string;
  initials: string;
  name: string;
  pin_color?: string;
    bot_version_id: number;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type Bot = Selectable<BotTable>
export type NewBot = Insertable<BotTable>
export type BotUpdate = Updateable<BotTable>
