import { ColumnType, Selectable } from 'kysely';

export interface ChargebotTemperatureAggregateTable {
  device_id: ColumnType<string, string, never>;
  bucket: ColumnType<Date, Date, never>;
  timezone: ColumnType<string, string, never>;
  variable: ColumnType<string, string, never>;
  value?: ColumnType<unknown, unknown | undefined, never>;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotTemperatureAggregate = Selectable<ChargebotTemperatureAggregateTable>;


// drop materialized view chargebot_temperature_aggregate;
// CREATE MATERIALIZED VIEW chargebot_temperature_aggregate
// WITH (timescaledb.continuous) AS
// select
// 	"device_id",
// 	"variable",
// 	time_bucket('5m', "timestamp") as "bucket",
// 	last(timezone, "timestamp") as timezone,
// 	max(coalesce(value_boolean::int, value_int, value_long, value_float, value_double)) as value
// from
// 	"chargebot_temperature"
// WHERE variable IN ('temperature')
// group by device_id, "bucket", "variable";

// select remove_continuous_aggregate_policy('chargebot_temperature_aggregate');
// SELECT add_continuous_aggregate_policy('chargebot_temperature_aggregate',
//   start_offset => INTERVAL '1 day',
//   end_offset => INTERVAL '60 minutes',
//   schedule_interval => INTERVAL '60 minutes');
 
// ALTER MATERIALIZED VIEW chargebot_temperature_aggregate set (timescaledb.materialized_only = false);