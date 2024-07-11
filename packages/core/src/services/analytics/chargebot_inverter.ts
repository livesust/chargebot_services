export * as ChargebotInverter from "./chargebot_inverter";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotInverter, InverterVariable } from "../../timescale/chargebot_inverter";

export async function getInverterStatus(bot_uuid: string): Promise<ChargebotInverter[]> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_inverter")
    .distinctOn("variable")
    .select(({ fn }) => [
      'variable',
      fn.coalesce(
        'value_int',
        'value_long',
        'value_float',
        'value_double'
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', [
      InverterVariable.SOLAR_POWER,
      InverterVariable.GRID_CURRENT,
      InverterVariable.GRID_VOLTAGE
    ])
    .orderBy('variable', 'desc')
    .orderBy('timestamp', 'desc')
    .execute();
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
    .execute();
}

export async function getEnergyUsageByHourBucket(bot_uuid: string, from: Date, to: Date): Promise<{
  hour: Date,
  variable: string,
  value: number
}[]> {
  const query = db
    .selectFrom("chargebot_inverter")
    // @ts-expect-error not overloads match
    .select(({ fn }) => [
      sql`time_bucket_gapfill('1 hour', "timestamp") AS hour`,
      'variable',
      fn.sum(fn.coalesce(
          'value_int',
          'value_long',
          'value_float',
          'value_double'
      )).as('value')
    ])
    .where('device_id', '=', bot_uuid)
    .where((eb) => eb.between('timestamp', from, to))
    .where('variable', 'in', [
      InverterVariable.SOLAR_CHARGE_DIFF,
      InverterVariable.GRID_CHARGE_DIFF,
      InverterVariable.ENERGY_USAGE
    ])
    .groupBy(['hour', 'variable'])
    .orderBy('hour', 'asc');
  
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
    .orderBy('time', 'desc')
    .executeTakeFirst();
}

export async function getMonthlyEnergyUsageByDay(bot_uuid: string, from: Date, to: Date): Promise<{
  time: Date,
  variable: string,
  value: number
}[]> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_inverter")
    // @ts-expect-error not overloads match
    .select(({ fn }) => [
      sql`time_bucket('1 day', "timestamp") as "time"`,
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
    .orderBy('time', 'desc')
    .executeTakeFirst();
}

export async function getYearlyEnergyUsageByMonth(bot_uuid: string, from: Date, to: Date): Promise<{
  time: Date,
  variable: string,
  value: number
}[]> {
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
    .where((eb) => eb.between('timestamp', from, to))
    .where('variable', '=', InverterVariable.ENERGY_USAGE)
    .groupBy(['time', 'variable'])
    .orderBy('time', 'asc')
    .execute();
}

export async function getDaysWithData(bot_uuid: string, from: Date, to: Date): Promise<{
  bucket: Date,
  number_of_records: number
}[]> {
  const query = db
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
    .orderBy('bucket', 'asc');
  
  // @ts-expect-error not overloads match
  return await query.execute();
}
