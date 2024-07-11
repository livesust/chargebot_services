export * as ChargebotBattery from "./chargebot_battery";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotBattery, BatteryVariables, BatteryFirmwareState, BatteryState } from "../../timescale/chargebot_battery";

export async function getBatteryStatus(bot_uuid: string): Promise<ChargebotBattery[]> {
  // @ts-expect-error ignore type
  return db
    .selectFrom("chargebot_battery")
    .distinctOn("variable")
    .select(({ fn }) => [
      'device_id',
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
      BatteryVariables.LEVEL_SOC,
      BatteryVariables.STATE
    ])
    .orderBy('variable', 'desc')
    .orderBy('timestamp', 'desc')
    .execute();
}

export async function getBatteryStatuses(bot_uuids: string[]): Promise<ChargebotBattery[]> {
  // @ts-expect-error ignore type
  return db
    .selectFrom("chargebot_battery")
    .distinctOn(["device_id", "variable"])
    .select(({ fn }) => [
      'device_id',
      'variable',
      fn.coalesce(
        'value_int',
        'value_long',
        'value_float',
        'value_double'
      ).as('value'),
    ])
    .where('device_id', 'in', bot_uuids)
    .where('variable', 'in', [
      BatteryVariables.LEVEL_SOC,
      BatteryVariables.STATE
    ])
    .orderBy('device_id', 'desc')
    .orderBy('variable', 'desc')
    .orderBy('timestamp', 'desc')
    .execute();
}

export async function getAvgBatteryLevel(bot_uuid: string, from: Date, to: Date): Promise<number | unknown> {
  const levelSoc: ChargebotBattery | undefined = await db
    .selectFrom("chargebot_battery")
    // @ts-expect-error not overloads match
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

export function translateBatteryState(state: number): BatteryState {
  if (state) {
    if (state == BatteryFirmwareState.DISCHARGING) {
      return BatteryState.DISCHARGING;
    } else if (state == BatteryFirmwareState.CHARGING) {
      return BatteryState.CHARGING;
    } else if (state == BatteryFirmwareState.IDLE) {
      return BatteryState.IDLE;
    }
  }
  return BatteryState.IDLE;
}
