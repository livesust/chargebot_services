export * as ChargebotPDU from "./chargebot_pdu";
import { sql } from "kysely";
import db from '../../timescale';
import { PDUFirmwareState, PDUState, PDUVariable, PDU_OUTLET_IDS } from "../../timescale/chargebot_pdu";
import { DateTime } from "luxon";
import { ChargebotPDUAggregate } from "../../timescale/chargebot_pdu_aggregate";

export async function getPDUStatus(bot_uuid: string): Promise<ChargebotPDUAggregate[]> {
  return db
    .selectFrom("chargebot_pdu_aggregate")
    // @ts-expect-error not overloads match
    .select([
      'device_id',
      'variable',
      sql`last(value, "bucket") as value`,
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', [PDUVariable.STATE, PDUVariable.CURRENT])
    .groupBy(['device_id', 'variable'])
    .execute();
}

export async function getConnectionStatus(bot_uuid: string): Promise<{
  timestamp: Date,
  connected: boolean
}> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_pdu_aggregate")
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
    .selectFrom("chargebot_pdu_aggregate")
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
        .selectFrom("chargebot_pdu_aggregate")
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

export async function getOutletsStatus(bot_uuid: string): Promise<{
  timestamp: Date,
  pdu_outlet_number: number,
  status: string
}[]> {
  // Returns the current status of all outlets
  /*
  select
    variable,
    last("timestamp", "timestamp") as "timestamp",
    last(value_int, "timestamp") as value
  from chargebot_pdu
  where device_id = 'aklAuLg'
  and variable like 'outlet_state_%'
  group by variable
  */
  // @ts-expect-error not overloads match
  const status: {
    timestamp: Date,
    pdu_outlet_number: number,
    status: string
  }[] = await db
    .selectFrom('chargebot_pdu_aggregate')
    // @ts-expect-error ignore overload not mapping
    .select([
      sql`last("bucket", "bucket") as timestamp`,
      sql`regexp_replace("variable", '[^0-9]*([0-9]+)$', '\\1')::int + 1 AS pdu_outlet_number`,
      sql`(case last("value", "bucket") when 0 then 'OFF' when 1 then 'ON' when 2 then 'LIMITED' when 3 then 'OFF SCHEDULE' else 'UNKNOWN' end) as status`
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'like', PDUVariable.OUTLET_STATE_WILDCARD)
    .groupBy('variable')
    .execute();

  return status;
}

export async function getOutletStatus(bot_uuid: string, pdu_outlet_number: number): Promise<{
  timestamp: Date,
  pdu_outlet_number: number,
  status: string
} | undefined> {
  // Returns the current status of all outlets
  /*
  select
    variable,
    last("timestamp", "timestamp") as "timestamp",
    last(value_int, "timestamp") as value
  from chargebot_pdu
  where device_id = 'aklAuLg'
  and variable = 'outlet_state_1'
  group by variable
  */
  // @ts-expect-error not overloads match
  const status: {
    timestamp: Date,
    pdu_outlet_number: number,
    status: string
  } = await db
    .selectFrom('chargebot_pdu_aggregate')
    // @ts-expect-error ignore overload not mapping
    .select([
      sql`last("bucket", "bucket") as timestamp`,
      sql`regexp_replace("variable", '[^0-9]*([0-9]+)$', '\\1')::int + 1 AS pdu_outlet_number`,
      sql`(case last("value", "bucket") when 0 then 'OFF' when 1 then 'ON' when 2 then 'LIMITED' when 3 then 'OFF SCHEDULE' else 'UNKNOWN' end) as status`
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', translatePduOutletNumber(pdu_outlet_number))
    .groupBy('variable')
    .executeTakeFirst();

  return status;
}

export async function getOutletPriorityCharging(bot_uuid: string): Promise<{timestamp: Date, outlet_id: number} | undefined> {
  // @ts-expect-error not overloads match
  const status: {timestamp: Date, outlet_id: number} | undefined = await db
    .selectFrom("chargebot_pdu_aggregate")
    // @ts-expect-error not overloads match
    .select([
      'bucket as timestamp',
      sql`value as outlet_id`
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', PDUVariable.OUTLET_PRIORITY)
    .orderBy('bucket', 'desc')
    .limit(1)
    .executeTakeFirst();

  return status;
}

export async function getCurrentHistory(bot_uuid: string, from: Date, to: Date): Promise<{
  date: Date,
  current: number
}[]> {
  const results = await db
    .with(
      'interpolated_values',
      (db) => db
        .selectFrom('chargebot_pdu_aggregate')
        // @ts-expect-error implicit any
        .select(() => [
          sql`time_bucket_gapfill('5 minute', "bucket") AS bucket_gapfill`,
          sql`interpolate(max(value)) as current`,
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', '=', PDUVariable.CURRENT)
        // Get interpolated data for 1 hour before start time
        // so it can interpolate with last values from previous hour
        .where((eb) => eb.between('bucket', DateTime.fromJSDate(from).minus({hour: 1}).toJSDate(), to))
        .groupBy('bucket_gapfill')
        .orderBy('bucket_gapfill', 'asc')
    )
    .selectFrom("interpolated_values")
    .select(() => [
      'bucket_gapfill as date',
      sql`current as current`,
    ])
    .where((eb) => eb.between('bucket_gapfill', from, to))
    .execute();

    // @ts-expect-error not overloads match
    return results;
}

export async function getStateHistory(bot_uuid: string, from: Date, to: Date): Promise<{
  start_date: Date,
  end_date: Date,
  pdu_state: string
}[]> {
  const results = await db
    .with(
      'state_values',
      (db) => db
        .selectFrom('chargebot_pdu_aggregate')
        // @ts-expect-error ignore overload not mapping
        .select([
          'bucket as timestamp',
          sql`(
          case value
            when 1 then 'STARTUP'
            when 4 then 'LIMITED'
            when 5 then 'LIMITED'
            when 9 then 'LIMITED'
            when 8 then 'SHUTDOWN'
            when 6 then 'PRIORITY'
            when 7 then 'HIGH_TEMP'
            else 'NORMAL'
          end) as pdu_state`
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', '=', PDUVariable.STATE)
        .where((eb) => eb.between('bucket', from, to))
    )
    .with(
      'grouped_values',
      (db) => db
        .selectFrom('state_values')
        .select([
          'timestamp',
          'pdu_state',
          sql`ROW_NUMBER() OVER (ORDER BY "timestamp") - 
              ROW_NUMBER() OVER (PARTITION BY pdu_state ORDER BY "timestamp") AS group_id`
        ])
    )
    .with(
      'grouped_intervals',
      (db) => db
        .selectFrom('grouped_values')
        // @ts-expect-error implicit any
        .select([
          sql`min("timestamp") AS start_date`,
          sql`max("timestamp") AS max_timestamp`,
          sql`LEAD(MIN("timestamp")) OVER (ORDER BY MIN("timestamp")) AS end_date`,
          'pdu_state'
        ])
        .groupBy(['pdu_state', 'group_id'])
    )
    .selectFrom('grouped_intervals')
    .select([
      'start_date',
      sql`COALESCE(end_date, max_timestamp) AS end_date`,
      'pdu_state'
    ])
    .orderBy('start_date', 'asc')
    .execute();

  // @ts-expect-error not overloads match
  return results;
}

export function translatePduOutletNumber(pdu_outlet_number: number=1): PDUVariable {
  if (!pdu_outlet_number) {
    return PDUVariable.OUTLET_1_STATE;
  }

  return PDU_OUTLET_IDS[pdu_outlet_number-1];
}

export function translatePDUState(state: number): PDUState {
  if (state) {
    if (state == PDUFirmwareState.LIMITED_CHARGE_MODE || state == PDUFirmwareState.PROBING_OUTLETS || state == PDUFirmwareState.ECO_MODE) {
      return PDUState.LIMITED;
    } else if (state == PDUFirmwareState.SHUTDOWN) {
      return PDUState.SHUTDOWN;
    } else if (state == PDUFirmwareState.PRIORITY_CHARGE) {
      return PDUState.PRIORITY_CHARGE;
    } else if (state == PDUFirmwareState.HIGH_TEMP) {
      return PDUState.HIGH_TEMP;
    } else if (state == PDUFirmwareState.STARTUP) {
      return PDUState.STARTUP;
    }
  }
  return PDUState.NORMAL;
}
