import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { Bot } from "./bot";
import { User } from "./user";

export interface BotUserTable extends AuditedEntity {
  assignment_date: Date;
  bot_id: number;
  user_id: number;
  bot?: Bot;
  user?: User;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotUser = Selectable<BotUserTable>
export type NewBotUser = Insertable<BotUserTable>
export type BotUserUpdate = Updateable<BotUserTable>
