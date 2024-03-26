import { ColumnType, Selectable } from 'kysely'

/**
CREATE MATERIALIZED VIEW chargebot_battery_level_aggregate
WITH (timescaledb.continuous) AS
select
	"device_id",
	time_bucket('1m', "timestamp") as "time",
	timezone,
	last(coalesce(value_int, value_long, value_float, value_double), "timestamp") as battery_level
from
	"chargebot_battery"
where "variable" = 'state_of_charge'
group by device_id, "time", "timezone"
order by device_id asc, "time" desc;

SELECT add_continuous_aggregate_policy('chargebot_battery_level_aggregate',
  start_offset => INTERVAL '1 week',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '30 minutes');
 
ALTER MATERIALIZED VIEW chargebot_battery_level_aggregate set (timescaledb.materialized_only = false);
 */
export interface ChargebotBatteryLevelAggregate {
  device_id: ColumnType<string, never, never>,
  time: ColumnType<Date, never, never>,
  timezone: ColumnType<string, never, never>,
  battery_level: ColumnType<number, never, never>
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotBatteryLevel = Selectable<ChargebotBatteryLevelAggregate>
