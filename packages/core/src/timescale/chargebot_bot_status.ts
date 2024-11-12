import { ColumnType, Selectable } from 'kysely'

export interface ChargebotBotStatusTable {
  id: ColumnType<number, never, never>,
  device_id: ColumnType<string, never, never>,
  device_version: ColumnType<string, never, never>,
  component: ColumnType<string, never, never>,
  timestamp: ColumnType<Date, never, never>,
  timezone: ColumnType<string, never, never>,
  variable: ColumnType<string, never, never>,
  address: ColumnType<string, never, never>,
  value: ColumnType<unknown, never, never>,
  value_boolean: ColumnType<boolean, never, never>,
  value_int: ColumnType<number, never, never>,
  value_long: ColumnType<number, never, never>,
  value_float: ColumnType<number, never, never>,
  value_double: ColumnType<number, never, never>,
  value_string: ColumnType<string, never, never>,
  unit: ColumnType<string, never, never>,
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotBotStatus = Selectable<ChargebotBotStatusTable>

export enum BotComponents {
  INVERTER = 'inverter',
  BATTERY = 'battery',
  PDU = 'pdu',
  TEMPERATURE = 'temperature',
  FAN = 'fan',
  GPS = 'gps',
  SYSTEM = 'system',
}


