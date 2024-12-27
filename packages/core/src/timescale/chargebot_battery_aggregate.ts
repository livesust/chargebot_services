import { ColumnType, Selectable } from 'kysely'

export interface ChargebotBatteryAggregateTable {
  device_id: ColumnType<string, never, never>,
  variable: ColumnType<string, never, never>,
  bucket: ColumnType<Date, never, never>,
  timezone: ColumnType<string, never, never>,
  value: ColumnType<unknown, never, never>,
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotBatteryAggregate = Selectable<ChargebotBatteryAggregateTable>

// drop materialized view chargebot_battery_aggregate;
// CREATE MATERIALIZED VIEW chargebot_battery_aggregate
// WITH (timescaledb.continuous) AS
// select
// 	"device_id",
// 	"variable",
// 	time_bucket('5m', "timestamp") as "bucket",
// 	timezone,
// 	max(coalesce(value_int, value_long, value_float, value_double)) as value
// from
// 	"chargebot_battery"
// WHERE variable IN ('state_of_charge', 'battery_state', 'momentary_voltage', 'momentary_current')
// group by device_id, "bucket", "variable", "timezone";

// SELECT add_continuous_aggregate_policy('chargebot_battery_aggregate',
//   start_offset => INTERVAL '1 day',
//   end_offset => INTERVAL '5 minutes',
//   schedule_interval => INTERVAL '5 minutes');
 
// ALTER MATERIALIZED VIEW chargebot_battery_aggregate set (timescaledb.materialized_only = false);