import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export enum DayOfWeek {
  SUNDAY = "SUNDAY"
  MONDAY = "MONDAY"
  TUESDAY = "TUESDAY"
  WEDNESDAY = "WEDNESDAY"
  THURSDAY = "THURSDAY"
  FRIDAY = "FRIDAY"
  SATURDAY = "SATURDAY"
}

export interface BotChargingSettingsTable extends AuditedEntity {
  day_of_week?: DayOfWeek;
    all_day?: boolean;
    start_time: Date;
  end_time: Date;
  bot_id: number;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotChargingSettings = Selectable<BotChargingSettingsTable>
export type NewBotChargingSettings = Insertable<BotChargingSettingsTable>
export type BotChargingSettingsUpdate = Updateable<BotChargingSettingsTable>
