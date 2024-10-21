import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface BotFirmwareVersionTable extends AuditedEntity {
  version_number: string;
  version_name: string;
  notes?: string;
  active_date?: Date;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotFirmwareVersion = Selectable<BotFirmwareVersionTable>
export type NewBotFirmwareVersion = Insertable<BotFirmwareVersionTable>
export type BotFirmwareVersionUpdate = Updateable<BotFirmwareVersionTable>
