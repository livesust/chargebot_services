import { ColumnType, Selectable } from 'kysely';

export interface ChargebotPDUAggregateTable {
  device_id: ColumnType<string, string, never>;
  bucket: ColumnType<Date, Date, never>;
  timezone: ColumnType<string, string, never>;
  variable: ColumnType<string, string, never>;
  value?: ColumnType<unknown, unknown | undefined, never>;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotPDUAggregate = Selectable<ChargebotPDUAggregateTable>;


// drop materialized view chargebot_pdu_aggregate;
// CREATE MATERIALIZED VIEW chargebot_pdu_aggregate
// WITH (timescaledb.continuous) AS
// select
// 	"device_id",
// 	"variable",
// 	time_bucket('1m', "timestamp") as "bucket",
// 	last(timezone, "timestamp") as timezone,
// 	max(coalesce(value_boolean::int, value_int, value_long, value_float, value_double)) as value
// from
// 	"chargebot_pdu"
// WHERE variable IN ('current', 'state', 'outlet_priority') or variable like 'outlet_state_%'
// group by device_id, "bucket", "variable";

// select remove_continuous_aggregate_policy('chargebot_pdu_aggregate');
// SELECT add_continuous_aggregate_policy('chargebot_pdu_aggregate',
//   start_offset => INTERVAL '1 day',
//   end_offset => INTERVAL '5 minutes',
//   schedule_interval => INTERVAL '5 minutes');
 
// ALTER MATERIALIZED VIEW chargebot_pdu_aggregate set (timescaledb.materialized_only = false);