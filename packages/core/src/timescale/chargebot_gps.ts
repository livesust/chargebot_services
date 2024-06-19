import { ColumnType, Selectable } from 'kysely'

export interface ChargebotGpsTable {
  id: ColumnType<number, never, never>,
  device_id: ColumnType<string, never, never>,
  timestamp: ColumnType<Date, never, never>,
  timezone: ColumnType<string, never, never>,
  vehicle_status: ColumnType<string, never, never>,
  lat: ColumnType<number, never, never>,
  lon: ColumnType<number, never, never>,
  altitude: ColumnType<number, never, never>,
  speed: ColumnType<number, never, never>,
  bearing: ColumnType<number, never, never>,
  distance: ColumnType<number, never, never>,
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotGps = Selectable<ChargebotGpsTable>

export enum VehicleStatus {
  AT_HOME = 'AT_HOME',
  MOVING = 'MOVING',
  STOPPED = 'STOPPED',
  PARKED = 'PARKED',
}

export interface ChargebotGpsHistory {
  start_time: Date,
  end_time: Date,
  latitude: number,
  longitude: number,
  distance: number,
  vehicle_status: string,
}

export interface ChargebotGpsPosition {
  timestamp: Date,
  latitude: number,
  longitude: number,
  vehicle_status: string,
  distance: number,
}