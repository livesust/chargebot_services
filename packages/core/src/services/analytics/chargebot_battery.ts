export * as ChargebotBattery from "./chargebot_battery";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotBattery, BatteryVariables } from "../../timescale/chargebot_battery";

export async function getBatteryStatus(bot_uuid: string): Promise<{
  bot_uuid: string,
  battery_level: number,
  battery_status: string
} | undefined> {
  // @ts-expect-error ignore type
  return db
    .with(
      'battery_status',
      (db) => db
        .selectFrom('chargebot_battery_level_aggregate')
        // @ts-expect-error ignore overload not mapping
        .select([
          'device_id',
          'battery_level',
          sql`battery_level - LAG(battery_level) OVER (ORDER BY "time") AS battery_level_diff`,
          sql`ROW_NUMBER() OVER (PARTITION BY device_id ORDER BY "time" DESC) AS row_number`
        ])
        .where('device_id', '=', bot_uuid)
        .orderBy('time', 'desc')
        .limit(1)
    )
    .selectFrom('battery_status')
    .select([
      'device_id as bot_uuid',
      'battery_level',
      sql`
      CASE
          WHEN battery_level_diff > 0 THEN 'CHARGING'
          WHEN battery_level_diff < 0 THEN 'DISCHARGING'
          ELSE 'IDLE'
      END AS battery_status
    `])
    .where('row_number', '=', 1)
    .executeTakeFirst();
}

export async function getBatteryStates(bot_uuids: string[]): Promise<{
  bot_uuid: string,
  battery_level: number,
  battery_status: string
}[] | undefined> {
  // @ts-expect-error not overloads match
  const status: {
    bot_uuid: string,
    battery_level: number,
    battery_status: string
  }[] = await db
    .with(
      'battery_status',
      (db) => db
        .selectFrom('chargebot_battery_level_aggregate')
        // @ts-expect-error ignore overload not mapping
        .select([
          'device_id',
          'battery_level',
          sql`battery_level - MAX(battery_level) OVER (ORDER BY "time" ROWS BETWEEN 5 PRECEDING AND 1 PRECEDING) AS battery_level_diff`,
          sql`ROW_NUMBER() OVER (PARTITION BY device_id ORDER BY "time" DESC) AS row_number`
        ])
        .where('device_id', 'in', bot_uuids)
    )
    .selectFrom('battery_status')
    .select([
      'device_id as bot_uuid',
      'battery_level',
      sql`
      CASE
          WHEN battery_level_diff > 0 THEN 'CHARGING'
          WHEN battery_level_diff < 0 THEN 'DISCHARGING'
          ELSE 'IDLE'
      END AS battery_status
    `])
    .where('row_number', '=', 1)
    .execute();

  return status;
}

export async function getAvgBatteryLevel(bot_uuid: string, from: Date, to: Date): Promise<number | unknown> {
  // @ts-expect-error not overloads match
  const levelSoc: ChargebotBattery | undefined = await db
    .selectFrom("chargebot_battery")
    .select(() => [
      sql`round(avg(coalesce(
        value_int,
        value_long,
        value_float,
        value_double
      ))) as value`,
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', BatteryVariables.LEVEL_SOC)
    .where((eb) => eb.between('timestamp', from, to))
    .executeTakeFirst();

  return levelSoc?.value ?? 0;
}

export async function getBatteryLevelByHourBucket(bot_uuid: string, from: Date, to: Date): Promise<{
  hour: Date,
  value: number
}[]> {
  const results = await db
    .selectFrom("chargebot_battery")
    // @ts-expect-error implicit any
    .select(() => [
      sql`time_bucket_gapfill('1 hour', "timestamp") AS hour`,
      sql`round(avg(coalesce(
        value_int,
        value_long,
        value_float,
        value_double
      ))) as value`,
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', BatteryVariables.LEVEL_SOC)
    .where((eb) => eb.between('timestamp', from, to))
    .groupBy('hour')
    .orderBy('hour', 'asc')
    .execute();

    // @ts-expect-error not overloads match
    return results;
}
