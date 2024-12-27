export * as ChargebotTemperature from "./chargebot_temperature";
import { sql } from "kysely";
import db from '../../timescale';
import { TemperatureVariables } from "../../timescale/chargebot_temperature";
import { ChargebotTemperatureAggregate } from "../../timescale/chargebot_temperature_aggregate";

export async function getTemperature(bot_uuid: string): Promise<ChargebotTemperatureAggregate | undefined> {
  return db
    .selectFrom("chargebot_temperature_aggregate")
    // @ts-expect-error not overloads match
    .select([
      'device_id',
      'variable',
      sql`last(value, "bucket") as value`,
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', TemperatureVariables.TEMPERATURE)
    .groupBy(['device_id', 'variable'])
    .executeTakeFirst();
}

export async function getConnectionStatus(bot_uuid: string): Promise<{
  timestamp: Date,
  connected: boolean
}> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_temperature_aggregate")
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
    .selectFrom("chargebot_temperature_aggregate")
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
        .selectFrom("chargebot_temperature_aggregate")
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
