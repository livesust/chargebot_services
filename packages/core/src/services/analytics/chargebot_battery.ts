export * as ChargebotBattery from "./chargebot_battery";
import { sql } from "kysely";
import db from '../../api';
import { ChargebotBattery, BatteryVariables } from "../../api/chargebot_battery";
import { ChargebotInverter } from "./chargebot_inverter";

export async function getBatteryLevel(bot_uuid: string): Promise<number | undefined> {
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

  return levelSoc?.value ? Math.round(levelSoc?.value as number) : ChargebotInverter.getBatteryLevel(bot_uuid);
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
