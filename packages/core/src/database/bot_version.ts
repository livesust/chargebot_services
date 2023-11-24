import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface BotVersionTable extends AuditedEntity {
  version_number: string;
  version_name: string;
  notes?: string;
  active_date?: Date;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotVersion = Selectable<BotVersionTable>
export type NewBotVersion = Insertable<BotVersionTable>
export type BotVersionUpdate = Updateable<BotVersionTable>
