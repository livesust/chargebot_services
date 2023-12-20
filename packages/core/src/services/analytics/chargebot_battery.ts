export * as ChargebotBattery from "./chargebot_battery";
import { sql } from "kysely";
import db from '../../api';
import { ChargebotBattery, BatteryVariables } from "../../api/chargebot_battery";

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
        sql`value_int::text`,
        sql`value_long::text`,
        sql`value_float::text`,
        sql`value_double::text`
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', BatteryVariables.LEVEL_SOC)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();

  return levelSoc?.value ? Math.round(levelSoc?.value as number) : undefined;
}