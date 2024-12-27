export * as ChargebotBattery from "./chargebot_battery";
import { sql } from "kysely";
import db from '../../timescale';
import { BatteryVariables, BatteryFirmwareState, BatteryState } from "../../timescale/chargebot_battery";
import { DateTime } from "luxon";
import { ChargebotBatteryAggregate } from "../../timescale/chargebot_battery_aggregate";

export async function getBatteryStatus(bot_uuid: string): Promise<ChargebotBatteryAggregate[]> {
  return db
    .selectFrom("chargebot_battery_aggregate")
    // @ts-expect-error not overloads match
    .select(() => [
      'variable',
      sql`last(value, bucket) as value`,
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', [
      BatteryVariables.LEVEL_SOC,
      BatteryVariables.STATE
    ])
    .groupBy('variable')
    .execute();
}

export async function getBatteryStatusByBots(bot_uuids: string[]): Promise<ChargebotBatteryAggregate[]> {
  // @ts-expect-error ignore type
  return db
    .selectFrom("chargebot_battery_aggregate")
    .distinctOn(["device_id", "variable"])
    .select([
      'device_id',
      'variable',
      'value',
    ])
    .where('device_id', 'in', bot_uuids)
    .where('variable', 'in', [
      BatteryVariables.LEVEL_SOC,
      BatteryVariables.STATE
    ])
    .orderBy('device_id', 'desc')
    .orderBy('variable', 'desc')
    .orderBy('bucket', 'desc')
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
        .selectFrom('chargebot_battery_aggregate')
        .distinctOn(['device_id', 'variable'])
        // @ts-expect-error implicit any
        .select(() => [
          'device_id',
          'variable',
          'value',
        ])
        .where('device_id', 'in', device_ids)
        .where('variable', 'in', [
          BatteryVariables.STATE,
          BatteryVariables.LEVEL_SOC
        ])
        .orderBy('device_id', 'asc')
        .orderBy('variable', 'asc')
        .orderBy('bucket', 'desc')
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

export async function countLowBatteryBots(device_ids: string[]): Promise<number> {
  const result: unknown[] = await db
    .with(
      'latest_values',
      (db) => db
        .selectFrom('chargebot_battery_aggregate')
        // @ts-expect-error implicit any
        .select(() => [
          'device_id',
          'variable',
          sql`max(bucket) as timestamp`,
          sql`last(value, bucket) AS value`,
        ])
        .where('device_id', 'in', device_ids)
        .where('variable', 'in', [
          BatteryVariables.STATE,
          BatteryVariables.LEVEL_SOC
        ])
        .groupBy(['device_id', 'variable'])
    )
    .selectFrom("latest_values")
    .select('device_id')
    .groupBy('device_id')
    .having(sql`max(case when variable = 'state_of_charge' then value end)`, '<', 12)
    .having(sql`max(case when variable = 'battery_state' then value end)`, '=', BatteryFirmwareState.DISCHARGING)
    .execute()
    .catch(error => {
      console.log(error);
      throw error;
    });
  return result?.length ?? 0;
}

export async function getConnectionStatus(bot_uuid: string): Promise<{
  timestamp: Date,
  connected: boolean
}> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_battery_aggregate")
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
    .executeTakeFirst();
}

export async function getConnectionStatusByBots(bot_uuids: string[]): Promise<{
  bot_uuid: string,
  timestamp: Date,
  connected: boolean
}[]> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_battery_aggregate")
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
  const count: unknown[] = await db
    .with(
      'connection_status',
      (db) => db
        .selectFrom("chargebot_battery_aggregate")
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
    .select('device_id')
    .where('connected', '=', conn_status)
    .groupBy('device_id')
    .execute()
    .catch(error => {
      console.log(error);
      throw error;
    });
    return count?.length ?? 0;
}

export async function getLastBatteryLevel(bot_uuid: string, from: Date, to: Date): Promise<number> {
  const levelSoc: ChargebotBatteryAggregate | undefined = await db
    .selectFrom("chargebot_battery_aggregate")
    // @ts-expect-error not overloads match
    .select(() => [
      sql`round(value) as value`,
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', BatteryVariables.LEVEL_SOC)
    .where((eb) => eb.between('bucket', from, to))
    .orderBy('bucket', 'desc')
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
        .selectFrom('chargebot_battery_aggregate')
        // @ts-expect-error implicit any
        .select(() => [
          sql`time_bucket_gapfill('5 minute', "bucket") AS bucket_gapfill`,
          'variable',
          sql`interpolate(max(value)) as value`,
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', 'in', [
          BatteryVariables.STATE,
          BatteryVariables.CURRENT,
          BatteryVariables.VOLTAGE
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

export async function getBatteryLevelByHourBucket(bot_uuid: string, from: Date, to: Date): Promise<{
  hour: Date,
  value: number
}[]> {
  const results = await db
    .with(
      'block_data',
      // Get report data
      (db) => db
        .selectFrom("chargebot_battery_aggregate")
        // @ts-expect-error implicit any
        .select(() => [
          sql`time_bucket_gapfill('1 hour', "bucket") AS hour`,
          sql`round(avg(value)) as value`,
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', '=', BatteryVariables.LEVEL_SOC)
        .where((eb) => eb.between('bucket', from, to))
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
