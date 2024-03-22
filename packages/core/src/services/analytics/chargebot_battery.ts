export * as ChargebotBattery from "./chargebot_battery";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotBattery, BatteryVariables } from "../../timescale/chargebot_battery";
import { ChargebotInverter } from "./chargebot_inverter";

export async function getBatteryLevel(bot_uuid: string): Promise<{
  bot_uuid: string,
  level: number | undefined
} | undefined> {
  // @ts-expect-error not overloads match
  const levelSoc: ChargebotBattery | undefined = await db
    .selectFrom("chargebot_battery")
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
    .where('variable', '=', BatteryVariables.LEVEL_SOC)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();

  return {
    bot_uuid,
    level: levelSoc?.value ? Math.round(levelSoc?.value as number) : await ChargebotInverter.getBatteryLevel(bot_uuid)
  };
}

export async function getBatteryLevels(bot_uuids: string[]): Promise<{
  bot_uuid: string,
  level: number | undefined
}[] | undefined> {
  // @ts-expect-error not overloads match
  const batteryLevels: ChargebotBattery[] | undefined = await db
    .selectFrom("chargebot_battery")
    .select(({ fn }) => [
      'device_id',
      fn.coalesce(
        sql`value_int`,
        sql`value_long`,
        sql`value_float`,
        sql`value_double`
      ).as('value'),
    ])
    .where('device_id', 'in', bot_uuids)
    .where('variable', '=', BatteryVariables.LEVEL_SOC)
    .orderBy('timestamp', 'desc')
    .groupBy('device_id')
    .limit(1)
    .executeTakeFirst();
  return batteryLevels?.map(bl => ({
    bot_uuid: bl.device_id,
    level: bl?.value ? Math.round(bl?.value as number) : undefined
  }));
}

export async function getBatteryState(bot_uuid: string): Promise<string | undefined> {
  // @ts-expect-error not overloads match
  const status: {battery_state: string} = await db
    .with(
      'battery_status',
      // @ts-expect-error ignore overload not mapping
      (db) => db
        .selectFrom('chargebot_battery')
        .select([
          'timestamp',
          sql`
            COALESCE(value_int, value_long, value_float, value_double)
            - LAG(COALESCE(value_int, value_long, value_float, value_double)) OVER (ORDER BY timestamp) AS diff
          `
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', '=', BatteryVariables.LEVEL_SOC)
        .orderBy('timestamp', 'desc')
        .limit(1)
    )
    .selectFrom('battery_status')
    .select([
      sql`
      CASE
          WHEN battery_status.diff > 0 THEN 'CHARGING'
          WHEN battery_status.diff < 0 THEN 'DISCHARGING'
          ELSE 'IDLE'
      END AS battery_state
    `])
    .limit(1)
    .executeTakeFirst();

  return status?.battery_state;
}

export async function getAvgBatteryLevel(bot_uuid: string, from: Date, to: Date): Promise<number | undefined> {
  // @ts-expect-error not overloads match
  const levelSoc: ChargebotBattery | undefined = await db
    .selectFrom("chargebot_battery")
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
    .where('variable', '=', BatteryVariables.LEVEL_SOC)
    .where('timestamp', '>=', from)
    .where('timestamp', '<=', to)
    .executeTakeFirst();

  return levelSoc?.value ? Math.round(levelSoc?.value as number) : ChargebotInverter.getAvgBatteryLevel(bot_uuid, from, to);
}

export async function getBatteryLevelByHourBucket(bot_uuid: string, from: Date, to: Date): Promise<{
  bucket: Date,
  min_value: number,
  max_value: number,
  avg_value: number
}[]> {
  const results = await db
    .selectFrom("chargebot_battery")
    // @ts-expect-error implicit any
    .select(({ fn }) => [
      sql`time_bucket_gapfill('1 hour', "timestamp") AS bucket`,
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
      sql`round(avg(coalesce(
        value_int,
        value_long,
        value_float,
        value_double
      ))) as avg_value`,
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', BatteryVariables.LEVEL_SOC)
    .where('timestamp', '>=', from)
    .where('timestamp', '<=', to)
    .groupBy('bucket')
    .orderBy('bucket', 'asc')
    .execute();

    // @ts-expect-error not overloads match
    return results && results.length > 0 ? results :  ChargebotInverter.getBatteryLevelByHourBucket(bot_uuid, from, to);
}
