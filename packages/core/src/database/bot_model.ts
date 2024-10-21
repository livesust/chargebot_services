import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface BotModelTable extends AuditedEntity {
  name: string;
  version: string;
  release_date: Date;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotModel = Selectable<BotModelTable>
export type NewBotModel = Insertable<BotModelTable>
export type BotModelUpdate = Updateable<BotModelTable>
