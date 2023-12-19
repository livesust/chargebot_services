import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface BotFirmwareTable extends AuditedEntity {
  inverter_version: string;
  pi_version: string;
  firmware_version: string;
  battery_version: string;
  pdu_version: string;
  notes?: string;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotFirmware = Selectable<BotFirmwareTable>
export type NewBotFirmware = Insertable<BotFirmwareTable>
export type BotFirmwareUpdate = Updateable<BotFirmwareTable>
