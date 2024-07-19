export * as ChargebotError from "./chargebot_error";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotError, ErrorCode, ErrorStatus } from "../../timescale/chargebot_error";

export async function getSystemStatus(bot_uuid: string): Promise<{
  value: number
} | undefined> {
  return db
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
}

export async function getActiveErrors(bot_uuid: string): Promise<ChargebotError[] | undefined> {
  // @ts-expect-error ignore
  return db
    .with(
      'block_errors',
      (db) => db
        .selectFrom('chargebot_error')
        // @ts-expect-error ignore overload not mapping
        .select([
          sql`max(timestamp) as timestamp`,
          'module',
          'level',
          'code',
          'name',
          sql`max(error_status) as error_status`,
          sql`max(resolved_on) as resolved_on`,
          sql`max(message) as message`,
          sql`max(occurrence_count) as occurrence_count`
        ])
        .where('device_id', '=', bot_uuid)
        .groupBy(['module', 'level', 'code', 'name'])
    )
    .selectFrom('block_errors')
    .selectAll()
    .where('error_status', '=', ErrorStatus.ACTIVE)
    .where('timestamp', '>', sql`now() - interval '7 days'`)
    .orderBy('timestamp', 'desc')
    .orderBy('level', 'desc')
    .execute()
}

export async function getPastErrors(bot_uuid: string): Promise<ChargebotError[] | undefined> {
  // @ts-expect-error ignore
  return db
    .with(
      'block_errors',
      (db) => db
        .selectFrom('chargebot_error')
        // @ts-expect-error ignore overload not mapping
        .select([
          sql`max(timestamp) as timestamp`,
          'module',
          'level',
          'code',
          'name',
          sql`max(error_status) as error_status`,
          sql`max(resolved_on) as resolved_on`,
          sql`max(message) as message`,
          sql`max(occurrence_count) as occurrence_count`
        ])
        .where('device_id', '=', bot_uuid)
        .groupBy(['module', 'level', 'code', 'name'])
    )
    .selectFrom('block_errors')
    .selectAll()
    .where('error_status', '=', ErrorStatus.RESOLVED)
    .where('timestamp', '>', sql`now() - interval '7 days'`)
    .orderBy('timestamp', 'desc')
    .orderBy('level', 'desc')
    .execute()
}
