export * as ChargebotTemperature from "./chargebot_temperature";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotTemperature, TemperatureVariables } from "../../timescale/chargebot_temperature";

export async function getTemperature(bot_uuid: string): Promise<ChargebotTemperature | undefined> {
  return db
    .selectFrom("chargebot_temperature")
    // @ts-expect-error not overloads match
    .select([
      'device_id',
      'variable',
      sql`last(coalesce (value_int, value_long, value_float, value_double), "timestamp") as value`,
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
    .selectFrom("chargebot_temperature")
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
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();
}
