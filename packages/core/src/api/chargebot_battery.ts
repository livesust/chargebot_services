import { ColumnType, Selectable } from 'kysely'

export interface ChargebotBatteryTable {
  id: ColumnType<number, never, never>,
  device_id: ColumnType<string, never, never>,
  device_version: ColumnType<string, never, never>,
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
  data_type: ColumnType<string, never, never>,
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotBattery = Selectable<ChargebotBatteryTable>

export enum BatteryVariables {
  LEVEL_SOC = 'state_of_charge',
  HEALTH = 'battery_health',
  FULL_CAPACITY = 'full_capacity',
  REMAINING_CAPACITY = 'remaining_capacity',
  CUMULATIVE_CHARGE = 'cumulative_charge',
  CUMULATIVE_CHARGE_COUNT = 'cumulative_charge_count',
  CUMULATIVE_CHARGE_KWH = 'cumulative_charge_kWh',
  CUMULATIVE_CHARGE_TIME = 'cumulative_charge_time',
  CUMULATIVE_DISCHARGE = 'cumulative_discharge',
  CUMULATIVE_DISCHARGE_COUNT = 'cumulative_discharge_count',
  CUMULATIVE_DISCHARGE_KWH = 'cumulative_discharge_kWh',
  CUMULATIVE_DISCHARGE_TIME = 'cumulative_discharge_time',
  CYCLE_COUNTS = 'cycle_counts',
}

