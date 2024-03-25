import { ColumnType, Selectable } from 'kysely'

export interface ChargebotBatteryLevelTable {
  device_id: ColumnType<string, never, never>,
  time: ColumnType<Date, never, never>,
  battery_level: ColumnType<number, never, never>
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotBatteryLevel = Selectable<ChargebotBatteryLevelTable>
