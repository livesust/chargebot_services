import { ColumnType, Selectable } from 'kysely';

export interface ChargebotSystemAggregateTable {
  device_id: ColumnType<string, string, never>;
  bucket: ColumnType<Date, Date, never>;
  timezone: ColumnType<string, string, never>;
  variable: ColumnType<string, string, never>;
  value?: ColumnType<unknown, unknown | undefined, never>;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotSystemAggregate = Selectable<ChargebotSystemAggregateTable>;


// drop materialized view chargebot_system_aggregate;
// CREATE MATERIALIZED VIEW chargebot_system_aggregate
// WITH (timescaledb.continuous) AS
// select
// 	"device_id",
// 	"variable",
// 	time_bucket('5m', "timestamp") as "bucket",
// 	last(timezone, "timestamp") as timezone,
// 	max(coalesce(value_boolean::int, value_int, value_long, value_float, value_double)) as value
// from
// 	"chargebot_system"
// WHERE variable IN ('connected', 'cpu_percent', 'memory_info', 'disk', 'temperature', 'uptime_minutes', 'undervoltage')
// group by device_id, "bucket", "variable";

// select remove_continuous_aggregate_policy('chargebot_system_aggregate');
// SELECT add_continuous_aggregate_policy('chargebot_system_aggregate',
//   start_offset => INTERVAL '1 day',
//   end_offset => INTERVAL '5 minutes',
//   schedule_interval => INTERVAL '5 minutes');
 
// ALTER MATERIALIZED VIEW chargebot_system_aggregate set (timescaledb.materialized_only = false);