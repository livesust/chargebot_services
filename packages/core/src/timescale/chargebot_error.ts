import { ColumnType, Selectable } from 'kysely'

export interface ChargebotErrorTable {
    id: ColumnType<number, never, never>,
    device_id: ColumnType<string, never, never>,
    device_version: ColumnType<string, never, never>,
    timestamp: ColumnType<Date, never, never>,
    timezone: ColumnType<string, never, never>,
    code: ColumnType<string, never, never>,
    name: ColumnType<string, never, never>,
    module: ColumnType<string, never, never>,
    level: ColumnType<string, never, never>,
    message: ColumnType<string, never, never>,
    error_status: ColumnType<string, never, never>,
    occurrence_count: ColumnType<number, never, never>,
    last_occurrence: ColumnType<Date, never, never>,
    resolved_on: ColumnType<Date, never, never>,
    notified_on: ColumnType<Date, never, never>,
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotError = Selectable<ChargebotErrorTable>

export enum ErrorCode {
  GENERAL = "E000",
  DEVICE_CONNECTION = "E001",
  DEVICE_CONFIG = "E002",
  DEVICE_VALUE_TYPE_CHECK = "E003",
  INTERNET_CONNECTION = "E100",
  MQTT_CONNECTION = "E101",
  SYSTEM_USAGE = "E500",
}

export enum ErrorLevel {
  MINOR = "MINOR",
  MEDIUM = "MEDIUM",
  EMERGENCY = "EMERGENCY",
}

export enum ErrorStatus {
  ACTIVE = "ACTIVE",
  RESOLVED = "RESOLVED",
}

export enum ErrorModule {
  INVERTER = "INVERTER",
  BATTERY = "BATTERY",
  GPS = "GPS",
  PDU = "PDU",
  TEMPERATURE = "TEMPERATURE",
  FAN = "FAN",
  GENERAL = "GENERAL",
}

