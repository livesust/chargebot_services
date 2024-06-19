import { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface ChargebotGeocodingTable {
  id: ColumnType<number, never, never>,
  timestamp: ColumnType<Date, never, never>,
  latitudes: ColumnType<number[], never, number[]>,
  longitudes: ColumnType<number[], never, number[]>,
  label: ColumnType<string, never, never>,
  country: ColumnType<string, never, never>,
  state: ColumnType<string, never, never>,
  county: ColumnType<string, never, never>,
  city: ColumnType<string, never, never>,
  neighborhood: ColumnType<string, never, never>,
  address_number: ColumnType<string, never, never>,
  street: ColumnType<string, never, never>,
  postal_code: ColumnType<string, never, never>,
  place_id: ColumnType<string, never, never>,
  timezone: ColumnType<string, never, never>,
  timezone_offset: ColumnType<number, never, never>,
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotGeocoding = Selectable<ChargebotGeocodingTable>
export type NewChargebotGeocodingTable = Insertable<ChargebotGeocodingTable>
export type ChargebotGeocodingTableUpdate = Updateable<ChargebotGeocodingTable>
