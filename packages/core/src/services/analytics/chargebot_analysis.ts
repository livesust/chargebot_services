export * as ChargebotAnalysis from "./chargebot_analysis";
import { sql } from "kysely";
import db from '../../timescale';
import { SystemVariables } from "../../timescale/chargebot_system";
import { BatteryVariables } from "../../timescale/chargebot_battery";
import { InverterVariable } from "../../timescale/chargebot_inverter";
import { PDUVariable } from "../../timescale/chargebot_pdu";
import { TemperatureVariables } from "../../timescale/chargebot_temperature";
import { FanVariables } from "../../timescale/chargebot_fan";
import { ErrorCode } from "../../timescale/chargebot_error";

export async function getHardwareStatus(bot_uuid: string): Promise<{
  variable: string,
  timestamp: Date,
  value: number
}[]> {
  // @ts-expect-error not overloads match
  return db
    .with(
      'inverter',
      (db) => db
        .selectFrom('chargebot_inverter')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'inverter_last_seen' as variable`,
          sql`max(timestamp) as timestamp`,
          sql`
          CASE
              WHEN max(timestamp) < NOW() - INTERVAL '30 minutes' THEN 0
              ELSE 1
          END as value`
        ])
        .where('device_id', '=', bot_uuid)
        .limit(1)
    )
    .with(
      'battery',
      (db) => db
        .selectFrom('chargebot_battery')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'battery_last_seen' as variable`,
          sql`max(timestamp) as timestamp`,
          sql`
          CASE
              WHEN max(timestamp) < NOW() - INTERVAL '30 minutes' THEN 0
              ELSE 1
          END as value`
        ])
        .where('device_id', '=', bot_uuid)
        .limit(1)
    )
    .with(
      'pdu',
      (db) => db
        .selectFrom('chargebot_pdu')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'pdu_last_seen' as variable`,
          sql`max(timestamp) as timestamp`,
          sql`
          CASE
              WHEN max(timestamp) < NOW() - INTERVAL '30 minutes' THEN 0
              ELSE 1
          END as value`
        ])
        .where('device_id', '=', bot_uuid)
        .limit(1)
    )
    .with(
      'gps',
      (db) => db
        .selectFrom('chargebot_gps')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'gps_last_seen' as variable`,
          sql`max(timestamp) as timestamp`,
          sql`
          CASE
              WHEN max(timestamp) < NOW() - INTERVAL '60 minutes' THEN 0
              ELSE 1
          END as value`
        ])
        .where('device_id', '=', bot_uuid)
        .limit(1)
    )
    .with(
      'temperature',
      (db) => db
        .selectFrom('chargebot_temperature')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'temperature_last_seen' as variable`,
          sql`max(timestamp) as timestamp`,
          sql`
          CASE
              WHEN max(timestamp) < NOW() - INTERVAL '30 minutes' THEN 0
              ELSE 1
          END as value`
        ])
        .where('device_id', '=', bot_uuid)
        .limit(1)
    )
    .with(
      'fan',
      (db) => db
        .selectFrom('chargebot_fan')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'fan_last_seen' as variable`,
          sql`max(timestamp) as timestamp`,
          sql`
          CASE
              WHEN max(timestamp) < NOW() - INTERVAL '30 minutes' THEN 0
              ELSE 1
          END as value`
        ])
        .where('device_id', '=', bot_uuid)
        .limit(1)
    )
    .with(
      'system',
      (db) => db
        .selectFrom('chargebot_system')
        // @ts-expect-error not overloads match
        .select(() => [
          'variable',
          sql`max(timestamp) as timestamp`,
          sql`last(coalesce (value_boolean::int, value_int, value_long, value_float, value_double), "timestamp") as value`
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', 'in', [
          SystemVariables.CONNECTED,
          SystemVariables.CPU,
          SystemVariables.MEMORY,
          SystemVariables.DISK,
          SystemVariables.TEMPERATURE,
          SystemVariables.UPTIME_MINUTES,
          SystemVariables.UNVERVOLTAGE
        ])
        .groupBy(['device_id', 'variable'])
    )
    .selectFrom('inverter')
    .unionAll((eb) => eb.selectFrom('battery').selectAll())
    .unionAll((eb) => eb.selectFrom('pdu').selectAll())
    .unionAll((eb) => eb.selectFrom('gps').selectAll())
    .unionAll((eb) => eb.selectFrom('temperature').selectAll())
    .unionAll((eb) => eb.selectFrom('fan').selectAll())
    .unionAll((eb) => eb.selectFrom('system').selectAll())
    .selectAll()
    .execute()
}

export async function getBotStatus(bot_uuid: string): Promise<{
  component: string,
  timestamp: Date,
  variable: string,
  value: number
}[]> {
  // @ts-expect-error not overloads match
  return db
    .with(
      'battery',
      (db) => db
        .selectFrom('chargebot_battery')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'battery' as component`,
          sql`max(timestamp) as timestamp`,
          'variable',
          sql`last(coalesce(value_boolean::int, value_int, value_long, value_float, value_double), "timestamp") as value`
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', 'in', [
          BatteryVariables.LEVEL_SOC,
          BatteryVariables.STATE
        ])
        .groupBy('variable')
    )
    .with(
      'inverter',
      (db) => db
        .selectFrom('chargebot_inverter')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'inverter' as component`,
          sql`max(timestamp) as timestamp`,
          'variable',
          sql`last(coalesce(value_boolean::int, value_int, value_long, value_float, value_double), "timestamp") as value`
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', 'in', [
          InverterVariable.SOLAR_POWER,
          InverterVariable.GRID_CURRENT,
          InverterVariable.GRID_VOLTAGE
        ])
        .groupBy('variable')
    )
    .with(
      'inverter_connection',
      (db) => db
        .selectFrom('chargebot_inverter')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'inverter' as component`,
          sql`max(timestamp) as timestamp`,
          sql`'connected' as variable`,
          sql`CASE
                WHEN max(timestamp) < NOW() - INTERVAL '30 minutes' THEN 0
                  ELSE 1
              END as value`
        ])
        .where('device_id', '=', bot_uuid)
    )
    .with(
      'pdu',
      (db) => db
        .selectFrom('chargebot_pdu')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'pdu' as component`,
          sql`max(timestamp) as timestamp`,
          'variable',
          sql`last(coalesce(value_boolean::int, value_int, value_long, value_float, value_double), "timestamp") as value`
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', 'in', [
          PDUVariable.STATE,
          PDUVariable.CURRENT,
        ])
        .groupBy('variable')
    )
    .with(
      'temperature',
      (db) => db
        .selectFrom('chargebot_temperature')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'temperature' as component`,
          sql`max(timestamp) as timestamp`,
          'variable',
          sql`last(coalesce(value_boolean::int, value_int, value_long, value_float, value_double), "timestamp") as value`
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', 'in', [
          TemperatureVariables.TEMPERATURE
        ])
        .groupBy('variable')
    )
    .with(
      'fan',
      (db) => db
        .selectFrom('chargebot_fan')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'fan' as component`,
          sql`max(timestamp) as timestamp`,
          'variable',
          sql`last(coalesce(value_boolean::int, value_int, value_long, value_float, value_double), "timestamp") as value`
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', 'in', [
          FanVariables.STATUS
        ])
        .groupBy('variable')
    )
    .with(
      'error',
      (db) => db
        .selectFrom('chargebot_error')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'error' as component`,
          sql`max(timestamp) as timestamp`,
          sql`'errors_count' as variable`,
          sql`count(id) as value`
        ])
        .where('device_id', '=', bot_uuid)
        .where('timestamp', '>', sql`NOW() - INTERVAL '15 minutes'`)
        .where('code', 'in', [
          ErrorCode.DEVICE_CONNECTION,
          ErrorCode.DEVICE_CONFIG
        ])
    )
    .with(
      'system',
      (db) => db
        .selectFrom('chargebot_system')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'system' as component`,
          sql`max(timestamp) as timestamp`,
          'variable',
          sql`last(coalesce(value_boolean::int, value_int, value_long, value_float, value_double), "timestamp") as value`
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', 'in', [
          SystemVariables.CONNECTED
        ])
        .groupBy('variable')
    )
    .with(
      'today_totals',
        (db) => db
        .selectFrom('chargebot_inverter')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`'system' as component`,
          sql`time_bucket('1 day', "timestamp") as day`,
          'variable',
          sql`sum(coalesce(value_int, value_long, value_float, value_double)) as value`
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', 'in', [
          InverterVariable.BATTERY_CHARGE_DIFF,
          InverterVariable.BATTERY_DISCHARGE_DIFF,
          InverterVariable.SOLAR_CHARGE_DIFF,
          InverterVariable.GRID_CHARGE_DIFF,
          InverterVariable.ENERGY_USAGE
        ])
        .where('timestamp', '>', sql`date_trunc('day', current_date at time zone 'UTC')`)
        .groupBy(['day', 'variable'])
    )
    .selectFrom('inverter')
    .unionAll((eb) => eb.selectFrom('battery').selectAll())
    .unionAll((eb) => eb.selectFrom('inverter').selectAll())
    .unionAll((eb) => eb.selectFrom('inverter_connection').selectAll())
    .unionAll((eb) => eb.selectFrom('pdu').selectAll())
    .unionAll((eb) => eb.selectFrom('temperature').selectAll())
    .unionAll((eb) => eb.selectFrom('fan').selectAll())
    .unionAll((eb) => eb.selectFrom('error').selectAll())
    .unionAll((eb) => eb.selectFrom('system').selectAll())
    .unionAll((eb) => eb.selectFrom('today_totals').select(() => [
      'component',
      'day as timestamp',
      'variable',
      'value'
    ]))
    .selectAll()
    .execute()
}




export async function getTodayTotals(bot_uuid: string): Promise<{
  timestamp: Date,
  variable: string,
  value: number
}[]> {
  // @ts-expect-error not overloads match
  return db
    .with(
      'today_totals',
        (db) => db
        .selectFrom('chargebot_inverter')
        // @ts-expect-error not overloads match
        .select(() => [
          sql`time_bucket('1 day', "timestamp") as day`,
          'variable',
          sql`sum(coalesce(value_int, value_long, value_float, value_double)) as value`
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', 'in', [
          InverterVariable.BATTERY_CHARGE_DIFF,
          InverterVariable.BATTERY_DISCHARGE_DIFF,
          InverterVariable.SOLAR_CHARGE_DIFF,
          InverterVariable.GRID_CHARGE_DIFF,
          InverterVariable.ENERGY_USAGE
        ])
        .where('timestamp', '>', sql`date_trunc('day', current_date at time zone 'UTC')`)
        .groupBy(['day', 'variable'])
    )
    .selectFrom('today_totals')
    .select(() => [
      'day as timestamp',
      'variable',
      'value'
    ])
    .execute()
}