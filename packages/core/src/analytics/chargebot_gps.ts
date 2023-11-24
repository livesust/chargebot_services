import { Selectable } from 'kysely'

export interface ChargebotGpsTable {
    device_id: string,
    device_version: string,
    timestamp: Date,
    timezone: string,
    lat: number,
    lat_unit: string,
    lon: number,
    lon_unit: string,
    altitude: number,
    altitude_unit: string,
    speed: number,
    speed_unit: string,
    bearing: number,
    bearing_unit: string,
    vehicle_status: string,
    quality: number,
    nav_mode: string,
    error: string,
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotGps = Selectable<ChargebotGpsTable>
