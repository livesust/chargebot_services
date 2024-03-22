export * as ChargebotError from "./chargebot_error";
import { sql } from "kysely";
import db from '../../timescale';
import { ErrorCode } from "../../timescale/chargebot_error";

export async function getSystemStatus(bot_uuid: string): Promise<string | undefined> {
  const count: { value: number; } | undefined = await db
    .selectFrom("chargebot_error")
    .select(({ fn }) => [
      fn.count<number>('id').as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('timestamp', '>', sql`now() - interval '15 minutes'`)
    .where('code', 'in', [
      ErrorCode.DEVICE_CONNECTION,
      ErrorCode.DEVICE_CONFIG,
      ErrorCode.DEVICE_CONNECTION
    ])
    .executeTakeFirst();

    return count && count.value > 0 ? 'ERROR' : 'OK';
}

export async function getConnectionStatus(bot_uuid: string): Promise<string | undefined> {
  const count: { value: number; } | undefined = await db
    .selectFrom("chargebot_error")
    .select(({ fn }) => [
      fn.count<number>('id').as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('timestamp', '>', sql`now() - interval '15 minutes'`)
    .where('code', 'in', [
      ErrorCode.INTERNET_CONNECTION,
      ErrorCode.MQTT_CONNECTION
    ])
    .executeTakeFirst();

  return count && count.value > 0 ? 'ERROR' : 'OK';
}
