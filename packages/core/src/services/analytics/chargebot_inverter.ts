export * as ChargebotInverter from "./chargebot_inverter";
import { sql } from "kysely";
import db from '../../api';
import { ChargebotInverter, InverterVariable } from "../../api/chargebot_inverter";

export async function getBatteryStatus(bot_uuid: string): Promise<string | undefined> {
  // @ts-expect-error not overloads match
  const batteryCurrent: ChargebotInverter | undefined = await db
    .selectFrom("chargebot_inverter")
    .select(({ fn }) => [
      'device_id',
      'device_version',
      'timestamp',
      'timezone',
      'variable',
      'address',
      'unit',
      'data_type',
      fn.coalesce(
        sql`value_int::text`,
        sql`value_long::text`,
        sql`value_float::text`,
        sql`value_double::text`
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', InverterVariable.BATTERY_CURRENT)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();

  if (!batteryCurrent?.value) {
    return undefined;
  }

  const current = batteryCurrent.value as number;
  if (current < 0) {
    return 'DISCHARGING';
  } else if (current > 0) {
    return 'CHARGING';
  }

  return 'IDLE';
}

export async function getInverterStatus(bot_uuid: string): Promise<ChargebotInverter[]> {
  // @ts-expect-error not overloads match
  const status: ChargebotInverter[] = await db
    .selectFrom("chargebot_inverter")
    .select(({ fn }) => [
      'device_id',
      'device_version',
      'timestamp',
      'timezone',
      'variable',
      'address',
      'unit',
      'data_type',
      fn.coalesce(
        'value_int',
        'value_long',
        'value_float',
        'value_double'
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', [
      InverterVariable.BATTERY_LEVEL_SOC,
      InverterVariable.BATTERY_CURRENT,
      InverterVariable.BATTERY_VOLTAGE,
      InverterVariable.BATTERY_POWER,
      InverterVariable.BATTERY_CHARGE_DIFF,
      InverterVariable.BATTERY_DISCHARGE_DIFF,
      InverterVariable.SOLAR_POWER,
      InverterVariable.SOLAR_CHARGE_DIFF,
      InverterVariable.GRID_CURRENT,
      InverterVariable.GRID_CHARGE_DIFF,
      InverterVariable.ENERGY_USAGE
    ])
    .orderBy('timestamp', 'desc')
    .limit(1)
    .execute();

  return status;
}

export async function getTodayEnergyUsage(bot_uuid: string): Promise<ChargebotInverter[]> {
  // @ts-expect-error not overloads match
  const status: ChargebotInverter[] = await db
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
    .where('timestamp', '>', sql`date_trunc('day', current_date at time zone 'UTC')`)
    .where('variable', 'in', [
      InverterVariable.BATTERY_CHARGE_DIFF,
      InverterVariable.BATTERY_DISCHARGE_DIFF,
      InverterVariable.SOLAR_CHARGE_DIFF,
      InverterVariable.GRID_CHARGE_DIFF,
      InverterVariable.ENERGY_USAGE
    ])
    .groupBy('variable')
    .execute();

  return status;
}

export async function getTotalEnergyUsage(bot_uuid: string, from: Date, to: Date): Promise<ChargebotInverter[]> {
  // @ts-expect-error not overloads match
  const status: ChargebotInverter[] = await db
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
    .where('timestamp', '>=', from)
    .where('timestamp', '<=', to)
    .where('variable', 'in', [
      InverterVariable.BATTERY_CHARGE_DIFF,
      InverterVariable.BATTERY_DISCHARGE_DIFF,
      InverterVariable.SOLAR_CHARGE_DIFF,
      InverterVariable.GRID_CHARGE_DIFF,
      InverterVariable.ENERGY_USAGE
    ])
    .groupBy('variable')
    .execute();

  return status;
}

export async function getEnergyUsageByHourBucket(bot_uuid: string, from: Date, to: Date): Promise<{
  bucket: Date,
  variable: string,
  min_value: number,
  max_value: number,
  avg_value: number
}[]> {
  // @ts-expect-error not overloads match
  return await db
    .selectFrom("chargebot_inverter")
    .select(({ fn }) => [
      sql`time_bucket('1 hour', "timestamp") AS bucket`,
      'variable',
      // @ts-expect-error not overloads match
      fn.min(fn.coalesce(
          'value_int',
          'value_long',
          'value_float',
          'value_double'
      )).as('min_value'),
      // @ts-expect-error not overloads match
      fn.max(fn.coalesce(
          'value_int',
          'value_long',
          'value_float',
          'value_double'
      )).as('max_value'),
      fn.avg(fn.coalesce(
          'value_int',
          'value_long',
          'value_float',
          'value_double'
      )).as('avg_value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('timestamp', '>=', from)
    .where('timestamp', '<=', to)
    .where('variable', 'in', [
      InverterVariable.SOLAR_CHARGE_DIFF,
      InverterVariable.GRID_CHARGE_DIFF,
      InverterVariable.ENERGY_USAGE
    ])
    .groupBy(['bucket', 'variable'])
    .orderBy('bucket', 'asc')
    .execute();
}

export async function getMonthlyEnergyUsage(bot_uuid: string): Promise<ChargebotInverter> {
  // @ts-expect-error not overloads match
  const status: ChargebotInverter = await db
    .selectFrom("chargebot_inverter")
    .select(({ fn }) => [
      fn.min('timestamp').as('timestamp'),
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
    .where('timestamp', '>', sql`date_trunc('month', current_date at time zone 'UTC')`)
    .where('variable', '=', InverterVariable.ENERGY_USAGE)
    .groupBy('variable')
    .executeTakeFirst();

  return status;
}

export async function getMonthlyEnergyUsageByDay(bot_uuid: string): Promise<ChargebotInverter[]> {
  // @ts-expect-error not overloads match
  return await db
    .selectFrom("chargebot_inverter")
    .select(({ fn }) => [
      sql`date_trunc('day', "timestamp")`.as('timestamp'),
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
    .where('timestamp', '>', sql`date_trunc('month', "timestamp")`)
    .where('variable', '=', InverterVariable.ENERGY_USAGE)
    .groupBy([sql`date_trunc('day', "timestamp")`, 'variable'])
    .orderBy(sql`date_trunc('day', "timestamp")`, 'asc')
    .execute();
}

export async function getYearlyEnergyUsage(bot_uuid: string): Promise<ChargebotInverter> {
  // @ts-expect-error not overloads match
  const status: ChargebotInverter = await db
    .selectFrom("chargebot_inverter")
    .select(({ fn }) => [
      fn.min('timestamp').as('timestamp'),
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
    .where('timestamp', '>', sql`date_trunc('year', current_date at time zone 'UTC')`)
    .where('variable', '=', InverterVariable.ENERGY_USAGE)
    .groupBy('variable')
    .executeTakeFirst();

  return status;
}

export async function getYearlyEnergyUsageByMonth(bot_uuid: string): Promise<ChargebotInverter[]> {
  // @ts-expect-error not overloads match
  return await db
    .selectFrom("chargebot_inverter")
    .select(({ fn }) => [
      sql`date_trunc('month', "timestamp")`.as('timestamp'),
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
    .where('timestamp', '>', sql`date_trunc('year', "timestamp")`)
    .where('variable', '=', InverterVariable.ENERGY_USAGE)
    .groupBy([sql`date_trunc('month', "timestamp")`, 'variable'])
    .orderBy(sql`date_trunc('month', "timestamp")`, 'asc')
    .execute();
}

export async function getBatteryLevel(bot_uuid: string): Promise<number | undefined> {
  // @ts-expect-error not overloads match
  const levelSoc: ChargebotBattery | undefined = await db
    .selectFrom("chargebot_inverter")
    .select(({ fn }) => [
      'device_id',
      'device_version',
      'timestamp',
      'timezone',
      'variable',
      'address',
      'unit',
      'data_type',
      fn.coalesce(
        sql`value_int`,
        sql`value_long`,
        sql`value_float`,
        sql`value_double`
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', InverterVariable.BATTERY_LEVEL_SOC)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();

  return levelSoc?.value ? Math.round(levelSoc?.value as number) : undefined;
}

export async function getAvgBatteryLevel(bot_uuid: string, from: Date, to: Date): Promise<number | undefined> {
  // @ts-expect-error not overloads match
  const levelSoc: ChargebotBattery | undefined = await db
    .selectFrom("chargebot_inverter")
    .select(({ fn }) => [
      fn.avg(
        fn.coalesce(
          'value_int',
          'value_long',
          'value_float',
          'value_double'
        )
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', InverterVariable.BATTERY_LEVEL_SOC)
    .where('timestamp', '>=', from)
    .where('timestamp', '<=', to)
    .executeTakeFirst();

  return levelSoc?.value ? Math.round(levelSoc?.value as number) : undefined;
}

export async function getBatteryLevelByHourBucket(bot_uuid: string, from: Date, to: Date): Promise<{
  bucket: Date,
  min_value: number,
  max_value: number,
  avg_value: number
}[]> {
  // @ts-expect-error not overloads match
  return await db
    .selectFrom("chargebot_inverter")
    // @ts-expect-error implicit any
    .select(({ fn }) => [
      sql`time_bucket('1 hour', "timestamp") AS bucket`,
      // @ts-expect-error not overloads match
      fn.min(fn.coalesce(
          'value_int',
          'value_long',
          'value_float',
          'value_double'
      )).as('min_value'),
      // @ts-expect-error not overloads match
      fn.max(fn.coalesce(
          'value_int',
          'value_long',
          'value_float',
          'value_double'
      )).as('max_value'),
      fn.avg(fn.coalesce(
          'value_int',
          'value_long',
          'value_float',
          'value_double'
      )).as('avg_value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', InverterVariable.BATTERY_LEVEL_SOC)
    .where('timestamp', '>=', from)
    .where('timestamp', '<=', to)
    .groupBy('bucket')
    .orderBy('bucket', 'asc')
    .execute();
}
