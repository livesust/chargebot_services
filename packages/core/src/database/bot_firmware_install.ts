import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { Bot } from "./bot";
import { BotFirmwareVersion } from "./bot_firmware_version";

export interface BotFirmwareInstallTable extends AuditedEntity {
  install_date: Date;
  active: boolean;
  bot_id: number;
  bot_firmware_version_id: number;
  bot?: Bot;
  bot_firmware_version?: BotFirmwareVersion;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotFirmwareInstall = Selectable<BotFirmwareInstallTable>
export type NewBotFirmwareInstall = Insertable<BotFirmwareInstallTable>
export type BotFirmwareInstallUpdate = Updateable<BotFirmwareInstallTable>
