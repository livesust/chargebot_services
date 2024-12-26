export * as ChargebotInverter from "./chargebot_inverter";
import { sql } from "kysely";
import db from '../../timescale';
import { InverterVariable } from "../../timescale/chargebot_inverter";
import { DateTime } from "luxon";
import { ChargebotInverterAggregate } from "../../timescale/chargebot_inverter_aggregate";

export async function getInverterStatus(bot_uuid: string): Promise<ChargebotInverterAggregate[]> {
  return db
    .selectFrom("chargebot_inverter_aggregate")
    // @ts-expect-error not overloads match
    .select(() => [
      'variable',
      sql`last(value, "bucket") as value`,
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
        .selectFrom('chargebot_inverter_aggregate')
        // @ts-expect-error implicit any
        .select(() => [
          sql`time_bucket_gapfill('5 minute', "bucket") AS bucket_gapfill`,
          'variable',
          sql`interpolate(max(value)) as value`,
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', 'in', [
          InverterVariable.GRID_CURRENT,
          InverterVariable.SOLAR_CURRENT,
          InverterVariable.GRID_CHARGE_CURRENT
        ])
        // Get interpolated data for 1 hour before start time
        // so it can interpolate with last values from previous hour
        .where((eb) => eb.between('bucket', DateTime.fromJSDate(from).minus({hour: 1}).toJSDate(), to))
        .groupBy(['bucket_gapfill', 'variable'])
        .orderBy('bucket_gapfill', 'asc')
        .orderBy('variable', 'asc')
    )
    .selectFrom("interpolated_values")
    .select(() => [
      'bucket_gapfill as date',
      'variable',
      sql`value as value`,
    ])
    .where((eb) => eb.between('bucket_gapfill', from, to))
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
    .selectFrom("chargebot_inverter_aggregate")
    // @ts-expect-error not overloads match
    .select(() => [
      sql`max(bucket) as timestamp`,
      sql`
      CASE
          WHEN max(bucket) < NOW() - INTERVAL '30 minutes' THEN false
          ELSE true
      END as connected`
    ])
    .where('device_id', '=', bot_uuid)
    .executeTakeFirst()
}

export async function getConnectionStatusByBots(bot_uuids: string[]): Promise<{
  bot_uuid: string,
  timestamp: Date,
  connected: boolean
}[]> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_inverter_aggregate")
    // @ts-expect-error not overloads match
    .select(() => [
      'device_id as bot_uuid',
      sql`max(bucket) as timestamp`,
      sql`
      CASE
          WHEN max(bucket) < NOW() - INTERVAL '30 minutes' THEN false
          ELSE true
      END as connected`
    ])
    .where('device_id', 'in', bot_uuids)
    .groupBy('device_id')
    .execute()
}

export async function countConnectionStatusByBots(bot_uuids: string[], conn_status: boolean): Promise<number> {
  const count: { value: number; } | undefined = await db
    .with(
      'connection_status',
      (db) => db
        .selectFrom("chargebot_inverter_aggregate")
        // @ts-expect-error not overloads match
        .select(() => [
          'device_id',
          sql`
          CASE
              WHEN max(bucket) < NOW() - INTERVAL '30 minutes' THEN false
              ELSE true
          END as connected`
        ])
        .where('device_id', 'in', bot_uuids)
        .groupBy('device_id')
    )
    .selectFrom('connection_status')
    .select(({ fn }) => [
      fn.count<number>('device_id').as('value'),
    ])
    .where('connected', '=', conn_status)
    .executeTakeFirst()
    .catch(error => {
      console.log(error);
      throw error;
    });
    return count?.value ?? 0;
}

export async function getTodayTotals(bot_uuid: string, variable: InverterVariable[]): Promise<{
  day: Date,
  variable: string,
  value: number
}[]> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_inverter_hourly_aggregate")
    // @ts-expect-error not overloads match
    .select(({ fn }) => [
      sql`max(bucket) as "day"`,
      'variable',
      fn.sum('value').as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', variable)
    .where('bucket', '>', sql`date_trunc('day', current_date at time zone 'UTC')`)
    .groupBy('variable')
    .orderBy('day', 'desc')
    .limit(variable.length)
    .execute();
}

export async function getTotalEnergyUsage(bot_uuid: string, from: Date, to: Date): Promise<ChargebotInverterAggregate[]> {
  // @ts-expect-error not overloads match
  return db
    .with(
      'block_data',
      // Get report data
      (db) => db
        .selectFrom("chargebot_inverter_hourly_aggregate")
        .select(({ fn }) => [
          'variable',
          fn.sum('value').as('value'),
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('bucket', from, to))
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
        .selectFrom("chargebot_inverter_hourly_aggregate")
        // @ts-expect-error not overloads match
        .select(({ fn }) => [
          sql`time_bucket_gapfill('1 hour', "bucket") as "hour"`,
          'variable',
          fn.sum('value').as('value'),
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('bucket', from, to))
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
    .selectFrom("chargebot_inverter_monthly_aggregate")
    // @ts-expect-error not overloads match
    .select(({ fn }) => [
      sql`max("bucket") as "time"`,
      'variable',
      fn.sum('value').as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', InverterVariable.ENERGY_USAGE)
    .where((eb) => eb.between('bucket', from, to))
    .groupBy('variable')
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
        .selectFrom("chargebot_inverter_daily_aggregate")
        // @ts-expect-error not overloads match
        .select(({ fn }) => [
          sql`time_bucket_gapfill('1 day', "bucket") as "time"`,
          'variable',
          fn.sum('value').as('value'),
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('bucket', from, to))
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
    .selectFrom("chargebot_inverter_yearly_aggregate")
    // @ts-expect-error not overloads match
    .select(({ fn }) => [
      sql`max("bucket") as "time"`,
      'variable',
      fn.sum('value').as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', InverterVariable.ENERGY_USAGE)
    .where((eb) => eb.between('bucket', from, to))
    .groupBy('variable')
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
        .selectFrom("chargebot_inverter_monthly_aggregate")
        // @ts-expect-error not overloads match
        .select(({ fn }) => [
          sql`time_bucket_gapfill('1 month', "bucket") as "time"`,
          'variable',
          fn.sum('value').as('value'),
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('bucket', from, to))
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
        .selectFrom("chargebot_inverter_daily_aggregate")
        // @ts-expect-error not overloads match
        .select(({ fn }) => [
          sql`time_bucket_gapfill('1 day', "bucket") AS bucket_gapfill`,
          fn.count<number>('device_id').as('number_of_records'),
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('bucket', from, to))
        .where('variable', 'in', [
          InverterVariable.SOLAR_CHARGE_DIFF,
          InverterVariable.GRID_CHARGE_DIFF,
          InverterVariable.ENERGY_USAGE
        ])
        .groupBy('bucket_gapfill')
        .orderBy('bucket_gapfill', 'asc')
    )
    .selectFrom('block_data')
    .select([
      'bucket_gapfill as bucket',
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
