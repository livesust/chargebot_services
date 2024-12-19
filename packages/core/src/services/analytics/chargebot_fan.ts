export * as ChargebotFan from "./chargebot_fan";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotFan, FanVariables } from "../../timescale/chargebot_fan";

export async function getFanStatus(bot_uuid: string): Promise<ChargebotFan | undefined> {
  return db
    .selectFrom("chargebot_fan")
    // @ts-expect-error not overloads match
    .select([
      'device_id',
      'variable',
      sql`last(coalesce (value_int, value_long, value_float, value_double), "timestamp") as value`,
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', FanVariables.STATUS)
    .groupBy(['device_id', 'variable'])
    .executeTakeFirst();
}

export async function getConnectionStatus(bot_uuid: string): Promise<{
  timestamp: Date,
  connected: boolean
}> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_fan")
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
    .selectFrom("chargebot_fan")
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

export async function countConnectionStatusByBots(bot_uuids: string[], conn_status: boolean): Promise<number> {
  const count: { value: number; } | undefined = await db
    .with(
      'connection_status',
      (db) => db
        .selectFrom("chargebot_fan")
        // @ts-expect-error not overloads match
        .select(() => [
          'device_id',
          sql`
          CASE
              WHEN max(timestamp) < NOW() - INTERVAL '30 minutes' THEN false
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
