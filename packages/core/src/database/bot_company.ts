import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface BotCompanyTable extends AuditedEntity {
  acquire_date: Date;
  bot_id: number;
  company_id: number;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotCompany = Selectable<BotCompanyTable>
export type NewBotCompany = Insertable<BotCompanyTable>
export type BotCompanyUpdate = Updateable<BotCompanyTable>
