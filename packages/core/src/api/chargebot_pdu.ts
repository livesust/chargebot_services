import { ColumnType, Selectable } from 'kysely'

export interface ChargebotPDUTable {
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
export type ChargebotPDU = Selectable<ChargebotPDUTable>

export enum PDUVariable {
  CURRENT = 'current',
  STATE = 'state',
  OUTLET_1_STATE = 'outlet_state_0',
  OUTLET_2_STATE = 'outlet_state_1',
  OUTLET_3_STATE = 'outlet_state_2',
  OUTLET_4_STATE = 'outlet_state_3',
  OUTLET_5_STATE = 'outlet_state_4',
  OUTLET_6_STATE = 'outlet_state_5',
  OUTLET_7_STATE = 'outlet_state_6',
  OUTLET_8_STATE = 'outlet_state_7',
}

export const PDU_OUTLET_IDS = [
  PDUVariable.OUTLET_1_STATE,
  PDUVariable.OUTLET_2_STATE,
  PDUVariable.OUTLET_3_STATE,
  PDUVariable.OUTLET_4_STATE,
  PDUVariable.OUTLET_5_STATE,
  PDUVariable.OUTLET_6_STATE,
  PDUVariable.OUTLET_7_STATE,
  PDUVariable.OUTLET_8_STATE,
]

