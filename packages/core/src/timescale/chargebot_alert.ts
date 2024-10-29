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
  GPS_ARRIVE_HOME = "A200",
  GPS_LEAVE_HOME = "A201",
  GPS_LONG_STOP = "A203",
  NOT_PLUGGED_IN = "A300",
  NOTHING_CHARGING = "A301",
  ABSENT_EQUIPMENT = "A400",
  ALL_EQUIPMENTS_PRESENT = "A401",
}

export enum AlertName {
  GENERAL = "general",
  BATTERY_CHARGING = "battery_charging",
  BATTERY_DISCHARGING = "battery_discharging",
  BATTERY_LOW = "battery_low",
  BATTERY_CRITICAL = "battery_critical",
  BATTERY_TEMPERATURE_LOW = "battery_temperature_low",
  BATTERY_TEMPERATURE_CRITICAL = "battery_temperature_critical",
  BATTERY_TEMPERATURE_NORMALIZED = "battery_temperature_normalized",
  GPS_ARRIVE_HOME = "gps_arrive_home",
  GPS_LEAVE_HOME = "gps_leave_home",
  GPS_LONG_STOP = "gps_long_stop",
  NOT_PLUGGED_IN = "not_plugged_in",
  NOTHING_CHARGING = "nothing_charging",
  ABSENT_EQUIPMENT = "absent_equipment",
  ALL_EQUIPMENTS_PRESENT = "all_equipments_present",
}
