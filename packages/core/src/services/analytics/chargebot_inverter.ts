export * as ChargebotInverter from "./chargebot_inverter";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotInverter, InverterVariable } from "../../timescale/chargebot_inverter";
import { DateTime } from "luxon";

export async function getInverterStatus(bot_uuid: string): Promise<ChargebotInverter[]> {
  return db
    .selectFrom("chargebot_inverter")
    // @ts-expect-error not overloads match
    .select(() => [
      'variable',
      sql`last(coalesce (value_int, value_long, value_float, value_double), "timestamp") as value`,
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', [
      InverterVariable.SOLAR_POWER,
      InverterVariable.GRID_CURRENT,
      InverterVariable.GRID_VOLTAGE
    ])
    .groupBy('variable')
    .execute();
}

export async function getHistory(bot_uuid: string, from: Date, to: Date): Promise<{
  date: Date,
  variable: string,
  value: number
}[]> {
  const results = await db
    .with(
      'interpolated_values',
      (db) => db
        .selectFrom('chargebot_inverter')
        // @ts-expect-error implicit any
        .select(() => [
          sql`time_bucket_gapfill('5 minute', "timestamp") AS bucket`,
          'variable',
          sql`interpolate(max(coalesce(value_int, value_long, value_float, value_double))) as value`,
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', 'in', [
          InverterVariable.GRID_CURRENT,
          InverterVariable.SOLAR_CURRENT,
          InverterVariable.GRID_CHARGE_CURRENT
        ])
        // Get interpolated data for 1 hour before start time
        // so it can interpolate with last values from previous hour
        .where((eb) => eb.between('timestamp', DateTime.fromJSDate(from).minus({hour: 1}).toJSDate(), to))
        .groupBy(['bucket', 'variable'])
        .orderBy('bucket', 'asc')
        .orderBy('variable', 'asc')
    )
    .selectFrom("interpolated_values")
    .select(() => [
      'bucket as date',
      'variable',
      sql`value as value`,
    ])
    .where((eb) => eb.between('bucket', from, to))
    .execute();

    // @ts-expect-error not overloads match
    return results;
}

export async function getConnectionStatus(bot_uuid: string): Promise<{
  timestamp: Date,
  connected: boolean
}> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_inverter")
    // @ts-expect-error not overloads match
    .select(() => [
      sql`max(timestamp) as timestamp`,
      sql`
      CASE
          WHEN max(timestamp) < NOW() - INTERVAL '30 minutes' THEN false
          ELSE true
      END as connected`
    ])
    .where('device_id', '=', bot_uuid)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst()
}

export async function getTodayTotals(bot_uuid: string, variable: InverterVariable[]): Promise<{
  day: Date,
  variable: string,
  value: number
}[]> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_inverter")
    // @ts-expect-error not overloads match
    .select(({ fn }) => [
      // data is stored in UTC and
      // time_bucket function uses UTC as default timezone for buckets definition
      sql`time_bucket('1 day', "timestamp") as "day"`,
      'variable',
      fn.sum(
        fn.coalesce(
          'value_int',
          'value_long',
          'value_float',
          'value_double'
        )
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', variable)
    .where('timestamp', '>', sql`date_trunc('day', current_date at time zone 'UTC')`)
    .groupBy(['day', 'variable'])
    .orderBy('day', 'desc')
    .limit(variable.length)
    .execute();
}

export async function getTotalEnergyUsage(bot_uuid: string, from: Date, to: Date): Promise<ChargebotInverter[]> {
  // @ts-expect-error not overloads match
  return db
    .with(
      'block_data',
      // Get report data
      (db) => db
        .selectFrom("chargebot_inverter")
        .select(({ fn }) => [
          'variable',
          fn.sum(
            fn.coalesce(
              'value_int',
              'value_long',
              'value_float',
              'value_double'
            )
          ).as('value'),
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('timestamp', from, to))
        .where('variable', 'in', [
          InverterVariable.BATTERY_CHARGE_DIFF,
          InverterVariable.BATTERY_DISCHARGE_DIFF,
          InverterVariable.SOLAR_CHARGE_DIFF,
          InverterVariable.GRID_CHARGE_DIFF,
          InverterVariable.ENERGY_USAGE
        ])
        .groupBy('variable')
    )
    .selectFrom('block_data')
    // @ts-expect-error not overloads match
    .select([
      'variable',
      sql`
        case 
          when value is not NULL then value
          else 0
        end as value
      `
    ])
    .execute();
}

export async function getEnergyUsageByHourBucket(bot_uuid: string, from: Date, to: Date): Promise<{
  hour: Date,
  variable: string,
  value: number
}[]> {
  const query = db
    .with(
      'block_data',
      // Get report data
      (db) => db
        .selectFrom("chargebot_inverter")
        // @ts-expect-error not overloads match
        .select(({ fn }) => [
          sql`time_bucket_gapfill('1 hour', "timestamp") as "hour"`,
          'variable',
          fn.sum(
            fn.coalesce(
              'value_int',
              'value_long',
              'value_float',
              'value_double'
            )
          ).as('value'),
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('timestamp', from, to))
        .where('variable', 'in', [
          InverterVariable.SOLAR_CHARGE_DIFF,
          InverterVariable.GRID_CHARGE_DIFF,
          InverterVariable.ENERGY_USAGE
        ])
        .groupBy(['hour', 'variable'])
        .orderBy('hour', 'asc')
    )
    .selectFrom('block_data')
    .select([
      'hour',
      'variable',
      sql`
        case 
          when value is not NULL then value
          else 0
        end as value
      `
    ]);
  
  // @ts-expect-error not overloads match
  return query.execute();
}

export async function getMonthlyEnergyUsage(bot_uuid: string, from: Date, to: Date): Promise<{
  time: Date,
  variable: string,
  value: number
}> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_inverter")
    // @ts-expect-error not overloads match
    .select(({ fn }) => [
      sql`time_bucket('1 month', "timestamp") as "time"`,
      'variable',
      fn.sum(
        fn.coalesce(
          'value_int',
          'value_long',
          'value_float',
          'value_double'
        )
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', InverterVariable.ENERGY_USAGE)
    .where((eb) => eb.between('timestamp', from, to))
    .groupBy(['time', 'variable'])
    .executeTakeFirst();
}

export async function getMonthlyEnergyUsageByDay(bot_uuid: string, from: Date, to: Date): Promise<{
  time: Date,
  variable: string,
  value: number
}[]> {
  // @ts-expect-error not overloads match
  return db
    .with(
      'block_data',
      // Get report data
      (db) => db
        .selectFrom("chargebot_inverter")
        // @ts-expect-error not overloads match
        .select(({ fn }) => [
          sql`time_bucket_gapfill('1 day', "timestamp") as "time"`,
          'variable',
          fn.sum(
            fn.coalesce(
              'value_int',
              'value_long',
              'value_float',
              'value_double'
            )
          ).as('value'),
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('timestamp', from, to))
        .where('variable', '=', InverterVariable.ENERGY_USAGE)
        .groupBy(['time', 'variable'])
        .orderBy('time', 'asc')
    )
    .selectFrom('block_data')
    .select([
      'time',
      'variable',
      sql`
        case 
          when value is not NULL then value
          else 0
        end as value
      `
    ])
    .execute();
}

export async function getYearlyEnergyUsage(bot_uuid: string, from: Date, to: Date): Promise<{
  time: Date,
  variable: string,
  value: number
}> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_inverter")
    // @ts-expect-error not overloads match
    .select(({ fn }) => [
      sql`time_bucket('1 year', "timestamp") as "time"`,
      'variable',
      fn.sum(
        fn.coalesce(
          'value_int',
          'value_long',
          'value_float',
          'value_double'
        )
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', InverterVariable.ENERGY_USAGE)
    .where((eb) => eb.between('timestamp', from, to))
    .groupBy(['time', 'variable'])
    .executeTakeFirst();
}

export async function getYearlyEnergyUsageByMonth(bot_uuid: string, from: Date, to: Date): Promise<{
  time: Date,
  variable: string,
  value: number
}[]> {
  // @ts-expect-error not overloads match
  return db
    .with(
      'block_data',
      // Get report data
      (db) => db
        .selectFrom("chargebot_inverter")
        // @ts-expect-error not overloads match
        .select(({ fn }) => [
          sql`time_bucket_gapfill('1 month', "timestamp") as "time"`,
          'variable',
          fn.sum(
            fn.coalesce(
              'value_int',
              'value_long',
              'value_float',
              'value_double'
            )
          ).as('value'),
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('timestamp', from, to))
        .where('variable', '=', InverterVariable.ENERGY_USAGE)
        .groupBy(['time', 'variable'])
        .orderBy('time', 'asc')
    )
    .selectFrom('block_data')
    .select([
      'time',
      'variable',
      sql`
        case 
          when value is not NULL then value
          else 0
        end as value
      `
    ])
    .execute();
}

export async function getDaysWithData(bot_uuid: string, from: Date, to: Date): Promise<{
  bucket: Date,
  number_of_records: number
}[]> {
  const query = db
    .with(
      'block_data',
      // Get report data
      (db) => db
        .selectFrom("chargebot_inverter")
        // @ts-expect-error not overloads match
        .select(({ fn }) => [
          sql`time_bucket_gapfill('1 day', "timestamp") AS bucket`,
          fn.count<number>('id').as('number_of_records'),
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('timestamp', from, to))
        .where('variable', 'in', [
          InverterVariable.SOLAR_CHARGE_DIFF,
          InverterVariable.GRID_CHARGE_DIFF,
          InverterVariable.ENERGY_USAGE
        ])
        .groupBy('bucket')
        .orderBy('bucket', 'asc')
    )
    .selectFrom('block_data')
    .select([
      'bucket',
      sql`
        case 
          when number_of_records is not NULL then number_of_records
          else 0
        end as number_of_records
      `
    ])
    .execute();
  
  // @ts-expect-error not overloads match
  return await query.execute();
}
