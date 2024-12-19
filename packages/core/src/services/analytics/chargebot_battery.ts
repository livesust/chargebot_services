export * as ChargebotBattery from "./chargebot_battery";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotBattery, BatteryVariables, BatteryFirmwareState, BatteryState } from "../../timescale/chargebot_battery";
import { DateTime } from "luxon";

export async function getBatteryStatus(bot_uuid: string): Promise<ChargebotBattery[]> {
  return db
    .selectFrom("chargebot_battery")
    // @ts-expect-error not overloads match
    .select(() => [
      'variable',
      sql`last(coalesce (value_int, value_long, value_float, value_double), "timestamp") as value`,
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', [
      BatteryVariables.LEVEL_SOC,
      BatteryVariables.STATE
    ])
    .groupBy('variable')
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

export async function getLowBatteryBots(device_ids: string[]): Promise<{
  device_id: string;
  battery_level: number;
  battery_state: number;
}[]> {
  // @ts-expect-error ignore type
  return db
    .with(
      'latest_values',
      (db) => db
        .selectFrom('chargebot_battery')
        .distinctOn(['device_id', 'variable'])
        // @ts-expect-error implicit any
        .select(() => [
          sql`device_id`,
          'variable',
          sql`coalesce(value_int, value_long, value_float, value_double) as value`,
        ])
        .where('device_id', 'in', device_ids)
        .where('variable', 'in', [
          BatteryVariables.STATE,
          BatteryVariables.LEVEL_SOC
        ])
        .orderBy('device_id', 'asc')
        .orderBy('variable', 'asc')
        .orderBy('timestamp', 'desc')
    )
    .selectFrom("latest_values")
    .select(() => [
      'device_id',
      sql`max(case when variable = 'state_of_charge' then value end) as battery_level`,
      sql`max(case when variable = 'battery_state' then value end) as battery_state`
    ])
    .groupBy('device_id')
    .having(sql`max(case when variable = 'state_of_charge' then value end)`, '<', 12)
    .having(sql`max(case when variable = 'battery_state' then value end)`, '=', BatteryFirmwareState.DISCHARGING)
    .execute()
    .catch(error => {
      console.log(error);
      throw error;
    });
}

export async function getConnectionStatus(bot_uuid: string): Promise<{
  timestamp: Date,
  connected: boolean
}> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_battery")
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
    // .orderBy('timestamp', 'desc')
    // .limit(1)
    .executeTakeFirst();
}

export async function getConnectionStatusByBots(bot_uuids: string[]): Promise<{
  bot_uuid: string,
  timestamp: Date,
  connected: boolean
}[]> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_battery")
    // @ts-expect-error not overloads match
    .select(() => [
      'device_id as bot_uuid',
      sql`max(timestamp) as timestamp`,
      sql`
      CASE
          WHEN max(timestamp) < NOW() - INTERVAL '30 minutes' THEN false
          ELSE true
      END as connected`
    ])
    .where('device_id', 'in', bot_uuids)
    .groupBy('device_id')
    .execute()
}

export async function getLastBatteryLevel(bot_uuid: string, from: Date, to: Date): Promise<number> {
  const levelSoc: ChargebotBattery | undefined = await db
    .selectFrom("chargebot_battery")
    // @ts-expect-error not overloads match
    .select(() => [
      sql`round(coalesce(
        value_int,
        value_long,
        value_float,
        value_double
      )) as value`,
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', BatteryVariables.LEVEL_SOC)
    .where((eb) => eb.between('timestamp', from, to))
    .orderBy('timestamp', 'desc')
    .executeTakeFirst();

  return levelSoc?.value ? levelSoc?.value as number : 0;
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
        .selectFrom('chargebot_battery')
        // @ts-expect-error implicit any
        .select(() => [
          sql`time_bucket_gapfill('5 minute', "timestamp") AS bucket`,
          'variable',
          sql`interpolate(max(coalesce(value_int, value_long, value_float, value_double))) as value`,
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', 'in', [
          BatteryVariables.STATE,
          BatteryVariables.CURRENT,
          BatteryVariables.VOLTAGE
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

export async function getBatteryLevelByHourBucket(bot_uuid: string, from: Date, to: Date): Promise<{
  hour: Date,
  value: number
}[]> {
  const results = await db
    .with(
      'block_data',
      // Get report data
      (db) => db
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
    )
    .selectFrom('block_data')
    .select([
      'hour',
      sql`
        case 
          when value is not NULL then value
          else 0
        end as value
      `
    ])
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
