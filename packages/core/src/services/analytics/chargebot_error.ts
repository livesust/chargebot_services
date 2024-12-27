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

export async function getTodayActiveErrorsByBot(bot_uuid: string): Promise<ChargebotError[] | undefined> {
  return getErrorsByBot(bot_uuid, ErrorStatus.ACTIVE, '24 hours')
}

export async function getTodayPastErrorsByBot(bot_uuid: string): Promise<ChargebotError[] | undefined> {
  return getErrorsByBot(bot_uuid, ErrorStatus.RESOLVED, '24 hours');
}

export async function getActiveErrorsByBot(bot_uuid: string): Promise<ChargebotError[] | undefined> {
  return getErrorsByBot(bot_uuid, ErrorStatus.ACTIVE, '7 days')
}

export async function getPastErrorsByBot(bot_uuid: string): Promise<ChargebotError[] | undefined> {
  return getErrorsByBot(bot_uuid, ErrorStatus.RESOLVED, '7 days');
}

export async function countTodayActiveErrorsByBot(bot_uuid: string): Promise<number> {
  return countErrorsByBot(bot_uuid, ErrorStatus.ACTIVE, '24 hours')
}

export async function countTodayPastErrorsByBot(bot_uuid: string): Promise<number> {
  return countErrorsByBot(bot_uuid, ErrorStatus.RESOLVED, '24 hours');
}

export async function countActiveErrorsByBot(bot_uuid: string): Promise<number> {
  return countErrorsByBot(bot_uuid, ErrorStatus.ACTIVE, '7 days')
}

export async function countPastErrorsByBot(bot_uuid: string): Promise<number> {
  return countErrorsByBot(bot_uuid, ErrorStatus.RESOLVED, '7 days');
}

export async function getTodayActiveErrorsByBots(bot_uuids: string[]): Promise<ChargebotError[] | undefined> {
  return getErrorsByBots(bot_uuids, ErrorStatus.ACTIVE, '24 hours')
}

export async function getTodayPastErrorsByBots(bot_uuids: string[]): Promise<ChargebotError[] | undefined> {
  return getErrorsByBots(bot_uuids, ErrorStatus.RESOLVED, '24 hours');
}

export async function getActiveErrorsByBots(bot_uuids: string[]): Promise<ChargebotError[] | undefined> {
  return getErrorsByBots(bot_uuids, ErrorStatus.ACTIVE, '7 days')
}

export async function getPastErrorsByBots(bot_uuids: string[]): Promise<ChargebotError[] | undefined> {
  return getErrorsByBots(bot_uuids, ErrorStatus.RESOLVED, '7 days');
}

export async function countTodayActiveErrorsByBots(bot_uuids: string[]): Promise<number> {
  return countErrorsByBots(bot_uuids, ErrorStatus.ACTIVE, '24 hours')
}

export async function countTodayPastErrorsByBots(bot_uuids: string[]): Promise<number> {
  return countErrorsByBots(bot_uuids, ErrorStatus.RESOLVED, '24 hours');
}

export async function countActiveErrorsByBots(bot_uuids: string[]): Promise<number> {
  return countErrorsByBots(bot_uuids, ErrorStatus.ACTIVE, '7 days')
}

export async function countPastErrorsByBots(bot_uuids: string[]): Promise<number> {
  return countErrorsByBots(bot_uuids, ErrorStatus.RESOLVED, '7 days');
}

export async function getErrorsByBot(bot_uuid: string, error_status: ErrorStatus, interval: string): Promise<ChargebotError[] | undefined> {
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
    .where('error_status', '=', error_status as string)
    .where('timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
    .orderBy('timestamp', 'desc')
    .orderBy('level', 'desc')
    .execute()
}

export async function countErrorsByBot(bot_uuid: string, error_status: ErrorStatus, interval: string): Promise<number> {
  const count: unknown[] = await db
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
          sql`max(error_status) as error_status`
        ])
        .where('device_id', '=', bot_uuid)
        .groupBy(['module', 'level', 'code', 'name'])
    )
    .selectFrom('block_errors')
    .select('name')
    .where('error_status', '=', error_status as string)
    .where('timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
    .groupBy('name')
    .execute()
    .catch(error => {
      console.log(error);
      throw error;
    });
    return count?.length ?? 0;
}

export async function getErrorsByBots(bot_uuids: string[], error_status: ErrorStatus, interval: string): Promise<ChargebotError[] | undefined> {
  // @ts-expect-error ignore
  return db
    .with(
      'block_errors',
      (db) => db
        .selectFrom('chargebot_error')
        // @ts-expect-error ignore
        .select([
          'device_id',
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
        .where('device_id', 'in', bot_uuids)
        .groupBy(['device_id', 'module', 'level', 'code', 'name'])
    )
    .selectFrom('block_errors')
    .selectAll()
    .where('error_status', '=', error_status as string)
    .where('timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
    .orderBy('timestamp', 'desc')
    .orderBy('level', 'desc')
    .execute()
    .catch(error => {
      console.log(error);
      throw error;
    });
}

export async function countErrorsByBots(bot_uuids: string[], error_status: ErrorStatus, interval: string): Promise<number> {
  const count: unknown[] = await db
    .with(
      'block_errors',
      (db) => db
        .selectFrom('chargebot_error')
        // @ts-expect-error ignore
        .select([
          'device_id',
          sql`max(timestamp) as timestamp`,
          sql`max(error_status) as error_status`,
          'module',
          'level',
          'code',
          'name',
        ])
        .where('device_id', 'in', bot_uuids)
        .groupBy(['device_id', 'module', 'level', 'code', 'name'])
    )
    .selectFrom('block_errors')
    .select('device_id')
    .where('error_status', '=', error_status as string)
    .where('timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
    .groupBy('device_id')
    .execute()
    .catch(error => {
      console.log(error);
      throw error;
    });
    return count?.length ?? 0;
}
