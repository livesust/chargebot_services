import { ColumnType, Selectable } from 'kysely'

export interface ChargebotGpsAggregateTable {
  device_id: ColumnType<string, never, never>,
  bucket: ColumnType<Date, never, never>,
  min_timestamp: ColumnType<Date, never, never>,
  max_timestamp: ColumnType<Date, never, never>,
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
export type ChargebotGpsAggregate = Selectable<ChargebotGpsAggregateTable>

// drop materialized view chargebot_gps_aggregate;
// CREATE MATERIALIZED VIEW chargebot_gps_aggregate
// WITH (timescaledb.continuous) AS
// select
// 	"device_id",
// 	time_bucket('1m', "timestamp") as "bucket",
// 	first("timestamp", "timestamp") as min_timestamp,
// 	last("timestamp", "timestamp") as max_timestamp,
// 	last(timezone, "timestamp") as timezone,
// 	last(vehicle_status, "timestamp") as vehicle_status,
// 	last(lat, "timestamp") as lat,
// 	last(lon, "timestamp") as lon,
// 	last(altitude, "timestamp") as altitude,
// 	last(speed, "timestamp") as speed,
// 	last(bearing, "timestamp") as bearing,
// 	last(distance, "timestamp") as distance
// from
// 	"chargebot_gps"
// group by device_id, "bucket";

// SELECT add_continuous_aggregate_policy('chargebot_gps_aggregate',
//   start_offset => INTERVAL '1 day',
//   end_offset => INTERVAL '5 minutes',
//   schedule_interval => INTERVAL '5 minutes');
 
// ALTER MATERIALIZED VIEW chargebot_gps_aggregate set (timescaledb.materialized_only = false);