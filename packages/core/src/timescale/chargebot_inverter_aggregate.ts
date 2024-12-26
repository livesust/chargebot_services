import { ColumnType, Selectable } from 'kysely';

export interface ChargebotInverterAggregateTable {
  device_id: ColumnType<string, string, never>;
  bucket: ColumnType<Date, Date, never>;
  timezone: ColumnType<string, string, never>;
  variable: ColumnType<string, string, never>;
  value?: ColumnType<unknown, unknown | undefined, never>;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotInverterAggregate = Selectable<ChargebotInverterAggregateTable>;


// drop materialized view chargebot_inverter_aggregate;
// select remove_continuous_aggregate_policy('chargebot_inverter_aggregate');
// CREATE MATERIALIZED VIEW chargebot_inverter_aggregate
// WITH (timescaledb.continuous) AS
// select
// 	"device_id",
// 	"variable",
// 	time_bucket('1m', "timestamp") as "bucket",
// 	last(timezone, "timestamp") as timezone,
// 	max(coalesce(value_boolean::int, value_int, value_long, value_float, value_double)) as value
// from
// 	"chargebot_inverter"
// WHERE variable IN ('pv_panel_power', 'pv_panel_current', 'grid_current', 'grid_voltage', 'mains_charge_current')
// group by device_id, "bucket", "variable";

// SELECT add_continuous_aggregate_policy('chargebot_inverter_aggregate',
//   start_offset => INTERVAL '1 day',
//   end_offset => INTERVAL '5 minutes',
//   schedule_interval => INTERVAL '5 minutes');
 
// ALTER MATERIALIZED VIEW chargebot_inverter_aggregate set (timescaledb.materialized_only = false);


// drop materialized view chargebot_inverter_hourly_aggregate;
// CREATE MATERIALIZED VIEW chargebot_inverter_hourly_aggregate
// WITH (timescaledb.continuous) AS
// select
// 	"device_id",
// 	"variable",
// 	time_bucket('1h', "timestamp") as "bucket",
// 	last(timezone, "timestamp") as timezone,
// 	sum(coalesce(value_boolean::int, value_int, value_long, value_float, value_double)) as value
// from
// 	"chargebot_inverter"
// WHERE variable IN ('batt_charge_diff', 'batt_discharge_diff', 'pv_charge_diff', 'mains_charge_diff', 'load_energy_usage')
// group by device_id, "bucket", "variable";

// select remove_continuous_aggregate_policy('chargebot_inverter_hourly_aggregate');
// SELECT add_continuous_aggregate_policy('chargebot_inverter_hourly_aggregate',
//   start_offset => NULL,
//   end_offset => INTERVAL '15 minutes',
//   schedule_interval => INTERVAL '15 minutes');
 
// ALTER MATERIALIZED VIEW chargebot_inverter_hourly_aggregate set (timescaledb.materialized_only = false);



// drop materialized view chargebot_inverter_daily_aggregate;
// CREATE MATERIALIZED VIEW chargebot_inverter_daily_aggregate
// WITH (timescaledb.continuous) AS
// select
// 	"device_id",
// 	"variable",
// 	time_bucket('1d', "timestamp") as "bucket",
// 	last(timezone, "timestamp") as timezone,
// 	sum(coalesce(value_boolean::int, value_int, value_long, value_float, value_double)) as value
// from
// 	"chargebot_inverter"
// WHERE variable IN ('batt_charge_diff', 'batt_discharge_diff', 'pv_charge_diff', 'mains_charge_diff', 'load_energy_usage')
// group by device_id, "bucket", "variable";

// select remove_continuous_aggregate_policy('chargebot_inverter_daily_aggregate');
// SELECT add_continuous_aggregate_policy('chargebot_inverter_daily_aggregate',
//   start_offset => NULL,
//   end_offset => INTERVAL '1 hour',
//   schedule_interval => INTERVAL '1 hour');
 
// ALTER MATERIALIZED VIEW chargebot_inverter_daily_aggregate set (timescaledb.materialized_only = false);


// drop materialized view chargebot_inverter_monthly_aggregate;
// CREATE MATERIALIZED VIEW chargebot_inverter_monthly_aggregate
// WITH (timescaledb.continuous) AS
// select
// 	"device_id",
// 	"variable",
// 	time_bucket('1 month', "timestamp") as "bucket",
// 	last(timezone, "timestamp") as timezone,
// 	sum(coalesce(value_boolean::int, value_int, value_long, value_float, value_double)) as value
// from
// 	"chargebot_inverter"
// WHERE variable IN ('batt_charge_diff', 'batt_discharge_diff', 'pv_charge_diff', 'mains_charge_diff', 'load_energy_usage')
// group by device_id, "bucket", "variable";

// select remove_continuous_aggregate_policy('chargebot_inverter_monthly_aggregate');
// SELECT add_continuous_aggregate_policy('chargebot_inverter_monthly_aggregate',
//   start_offset => NULL,
//   end_offset => INTERVAL '1 day',
//   schedule_interval => INTERVAL '1 day');
 
// ALTER MATERIALIZED VIEW chargebot_inverter_monthly_aggregate set (timescaledb.materialized_only = false);


// drop materialized view chargebot_inverter_yearly_aggregate;
// CREATE MATERIALIZED VIEW chargebot_inverter_yearly_aggregate
// WITH (timescaledb.continuous) AS
// select
// 	"device_id",
// 	"variable",
// 	time_bucket('1 year', "timestamp") as "bucket",
// 	last(timezone, "timestamp") as timezone,
// 	sum(coalesce(value_boolean::int, value_int, value_long, value_float, value_double)) as value
// from
// 	"chargebot_inverter"
// WHERE variable IN ('batt_charge_diff', 'batt_discharge_diff', 'pv_charge_diff', 'mains_charge_diff', 'load_energy_usage')
// group by device_id, "bucket", "variable";

// select remove_continuous_aggregate_policy('chargebot_inverter_yearly_aggregate');
// SELECT add_continuous_aggregate_policy('chargebot_inverter_yearly_aggregate',
//   start_offset => NULL,
//   end_offset => INTERVAL '1 month',
//   schedule_interval => INTERVAL '1 month');
 
// ALTER MATERIALIZED VIEW chargebot_inverter_yearly_aggregate set (timescaledb.materialized_only = false);
