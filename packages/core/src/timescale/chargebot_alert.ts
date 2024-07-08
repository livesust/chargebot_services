import { ColumnType, Selectable } from 'kysely'

export interface ChargebotAlertTable {
    id: ColumnType<number, never, never>,
    device_id: ColumnType<string, never, never>,
    device_version: ColumnType<string, never, never>,
    timestamp: ColumnType<Date, never, never>,
    timezone: ColumnType<string, never, never>,
    code: ColumnType<string, never, never>,
    name: ColumnType<string, never, never>,
    message: ColumnType<string, never, never>,
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotAlert = Selectable<ChargebotAlertTable>

export enum AlertCode {
  GENERAL = "A000",
  BATTERY_CHARGING = "A100",
  BATTERY_DISCHARGING = "A101",
  BATTERY_LOW = "A102",
  BATTERY_CRITICAL = "A103",
  BATTERY_TEMPERATURE_LOW = "A104",
  BATTERY_TEMPERATURE_CRITICAL = "A105",
  BATTERY_TEMPERATURE_NORMALIZED = "A106",
}
