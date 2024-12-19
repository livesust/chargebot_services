export * as ChargebotAlert from "./chargebot_alert";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotAlert } from "../../timescale/chargebot_alert";

export async function getActiveWarningAlertsByBot(botUuid: string): Promise<ChargebotAlert[] | undefined> {
  return getWarningAlertsByBot(botUuid, '1 year')
}

export async function getTodayWarningAlertsByBot(botUuid: string): Promise<ChargebotAlert[] | undefined> {
  return getWarningAlertsByBot(botUuid, '24 hour')
}

export async function getWarningAlertsByBot(botUuid: string, interval: string): Promise<ChargebotAlert[] | undefined> {
  return db
    .with(
      'last_battery_charging',
      (db) => db
        .selectFrom('chargebot_alert')
        .select(({ fn }) => [
          fn.max('timestamp').as('timestamp'),
          'device_id'
        ])
        .where('device_id', '=', botUuid)
        .where('name', '=', 'battery_charging')
        .where('timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .groupBy('device_id')
    )
    .with(
      'last_battery_temperature_normalized',
      (db) => db
        .selectFrom('chargebot_alert')
        .select(({ fn }) => [
          fn.max('timestamp').as('timestamp'),
          'device_id'
        ])
        .where('device_id', '=', botUuid)
        .where('name', '=', 'battery_temperature_normalized')
        .where('timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .groupBy('device_id')
    )
    .with(
      'battery_critical',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_charging'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', '=', botUuid)
        .where('chargebot_alert.name', '=', 'battery_critical')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where('chargebot_alert.timestamp', '>', sql`last_battery_charging.timestamp`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_low',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_charging', 'battery_critical'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', '=', botUuid)
        .where('chargebot_alert.name', '=', 'battery_low')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where('chargebot_alert.timestamp', '>', sql`last_battery_charging.timestamp`)
        .where('chargebot_alert.timestamp', '>', sql`battery_critical.timestamp`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_temperature_critical',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_temperature_normalized'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', '=', botUuid)
        .where('chargebot_alert.name', '=', 'battery_temperature_critical')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where('chargebot_alert.timestamp', '>', sql`last_battery_temperature_normalized.timestamp`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_temperature_low',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_temperature_normalized', 'battery_temperature_critical'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', '=', botUuid)
        .where('chargebot_alert.name', '=', 'battery_temperature_low')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where('chargebot_alert.timestamp', '>', sql`last_battery_temperature_normalized.timestamp`)
        .where('chargebot_alert.timestamp', '>', sql`battery_temperature_critical.timestamp`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .selectFrom('battery_low')
    .unionAll((eb) => eb.selectFrom('battery_critical').selectAll())
    .unionAll((eb) => eb.selectFrom('battery_temperature_low').selectAll())
    .unionAll((eb) => eb.selectFrom('battery_temperature_critical').selectAll())
    .selectAll()
    .execute()
    .catch(error => {
      console.log(error);
      throw error;
    });
}

export async function getActiveWarningAlertsByBots(botUuids: string[]): Promise<ChargebotAlert[] | undefined> {
  return getWarningAlertsByBots(botUuids, '1 year')
}

export async function getTodayWarningAlertsByBots(botUuids: string[]): Promise<ChargebotAlert[] | undefined> {
  return getWarningAlertsByBots(botUuids, '24 hours')
}

export async function getWarningAlertsByBots(botUuids: string[], interval: string): Promise<ChargebotAlert[] | undefined> {
  return db
    .with(
      'last_battery_charging',
      (db) => db
        .selectFrom('chargebot_alert')
        .select(({ fn }) => [
          fn.max('timestamp').as('timestamp'),
          'device_id'
        ])
        .where('device_id', 'in', botUuids)
        .where('name', '=', 'battery_charging')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .groupBy('device_id')
    )
    .with(
      'last_battery_temperature_normalized',
      (db) => db
        .selectFrom('chargebot_alert')
        .select(({ fn }) => [
          fn.max('timestamp').as('timestamp'),
          'device_id'
        ])
        .where('device_id', 'in', botUuids)
        .where('name', '=', 'battery_temperature_normalized')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .groupBy('device_id')
    )
    .with(
      'battery_critical',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_charging'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', 'in', botUuids)
        .where('chargebot_alert.name', '=', 'battery_critical')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where(sql`chargebot_alert.timestamp > (select lbc.timestamp from last_battery_charging lbc where lbc.device_id = chargebot_alert.device_id)`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_low',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_charging', 'battery_critical'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', 'in', botUuids)
        .where('chargebot_alert.name', '=', 'battery_low')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where(sql`chargebot_alert.timestamp > (select lbc.timestamp from last_battery_charging lbc where lbc.device_id = chargebot_alert.device_id)`)
        .where(sql`chargebot_alert.timestamp > (select bc.timestamp from battery_critical bc where bc.device_id = chargebot_alert.device_id)`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_temperature_critical',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_temperature_normalized'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', 'in', botUuids)
        .where('chargebot_alert.name', '=', 'battery_temperature_critical')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where(sql`chargebot_alert.timestamp > last_battery_temperature_normalized.timestamp`)
        .where(sql`chargebot_alert.timestamp > (select lbn.timestamp from last_battery_temperature_normalized lbn where lbn.device_id = chargebot_alert.device_id)`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_temperature_low',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_temperature_normalized', 'battery_temperature_critical'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', 'in', botUuids)
        .where('chargebot_alert.name', '=', 'battery_temperature_low')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where(sql`chargebot_alert.timestamp > (select lbn.timestamp from last_battery_temperature_normalized lbn where lbn.device_id = chargebot_alert.device_id)`)
        .where(sql`chargebot_alert.timestamp > (select bc.timestamp from battery_critical bc where bc.device_id = chargebot_alert.device_id)`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .selectFrom('battery_low')
    .unionAll((eb) => eb.selectFrom('battery_critical').selectAll())
    .unionAll((eb) => eb.selectFrom('battery_temperature_low').selectAll())
    .unionAll((eb) => eb.selectFrom('battery_temperature_critical').selectAll())
    .selectAll()
    .execute()
    .catch(error => {
      console.log(error);
      throw error;
    });
}

export async function countActiveWarningAlertsByBot(botUuid: string): Promise<number> {
  return countWarningAlertsByBot(botUuid, '1 year')
}

export async function countTodayWarningAlertsByBot(botUuid: string): Promise<number> {
  return countWarningAlertsByBot(botUuid, '24 hour')
}

export async function countWarningAlertsByBot(botUuid: string, interval: string): Promise<number> {
  const count: { value: number; } | undefined =  await db
    .with(
      'last_battery_charging',
      (db) => db
        .selectFrom('chargebot_alert')
        .select(({ fn }) => [
          fn.max('timestamp').as('timestamp'),
          'device_id'
        ])
        .where('device_id', '=', botUuid)
        .where('name', '=', 'battery_charging')
        .where('timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .groupBy('device_id')
    )
    .with(
      'last_battery_temperature_normalized',
      (db) => db
        .selectFrom('chargebot_alert')
        .select(({ fn }) => [
          fn.max('timestamp').as('timestamp'),
          'device_id'
        ])
        .where('device_id', '=', botUuid)
        .where('name', '=', 'battery_temperature_normalized')
        .where('timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .groupBy('device_id')
    )
    .with(
      'battery_critical',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_charging'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', '=', botUuid)
        .where('chargebot_alert.name', '=', 'battery_critical')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where('chargebot_alert.timestamp', '>', sql`last_battery_charging.timestamp`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_low',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_charging', 'battery_critical'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', '=', botUuid)
        .where('chargebot_alert.name', '=', 'battery_low')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where('chargebot_alert.timestamp', '>', sql`last_battery_charging.timestamp`)
        .where('chargebot_alert.timestamp', '>', sql`battery_critical.timestamp`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_temperature_critical',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_temperature_normalized'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', '=', botUuid)
        .where('chargebot_alert.name', '=', 'battery_temperature_critical')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where('chargebot_alert.timestamp', '>', sql`last_battery_temperature_normalized.timestamp`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_temperature_low',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_temperature_normalized', 'battery_temperature_critical'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', '=', botUuid)
        .where('chargebot_alert.name', '=', 'battery_temperature_low')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where('chargebot_alert.timestamp', '>', sql`last_battery_temperature_normalized.timestamp`)
        .where('chargebot_alert.timestamp', '>', sql`battery_temperature_critical.timestamp`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'all_alerts',
      (db) => db
        .selectFrom('battery_low')
        .selectAll()
        .unionAll((eb) => eb.selectFrom('battery_critical').selectAll())
        .unionAll((eb) => eb.selectFrom('battery_temperature_low').selectAll())
        .unionAll((eb) => eb.selectFrom('battery_temperature_critical').selectAll())
    )
    .selectFrom('all_alerts')
    .select(({ fn }) => [
      fn.count<number>('device_id').as('value'),
    ])
    .executeTakeFirst()
    .catch(error => {
      console.log(error);
      throw error;
    });
    return count?.value ?? 0;
}

export async function countActiveWarningAlertsByBots(botUuids: string[]): Promise<number> {
  return countWarningAlertsByBots(botUuids, '1 year')
}

export async function countTodayWarningAlertsByBots(botUuids: string[]): Promise<number> {
  return countWarningAlertsByBots(botUuids, '24 hours')
}

export async function countWarningAlertsByBots(botUuids: string[], interval: string): Promise<number> {
  const count: { value: number; } | undefined =  await db
    .with(
      'last_battery_charging',
      (db) => db
        .selectFrom('chargebot_alert')
        .select(({ fn }) => [
          fn.max('timestamp').as('timestamp'),
          'device_id'
        ])
        .where('device_id', 'in', botUuids)
        .where('name', '=', 'battery_charging')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .groupBy('device_id')
    )
    .with(
      'last_battery_temperature_normalized',
      (db) => db
        .selectFrom('chargebot_alert')
        .select(({ fn }) => [
          fn.max('timestamp').as('timestamp'),
          'device_id'
        ])
        .where('device_id', 'in', botUuids)
        .where('name', '=', 'battery_temperature_normalized')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .groupBy('device_id')
    )
    .with(
      'battery_critical',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_charging'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', 'in', botUuids)
        .where('chargebot_alert.name', '=', 'battery_critical')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where(sql`chargebot_alert.timestamp > (select lbc.timestamp from last_battery_charging lbc where lbc.device_id = chargebot_alert.device_id)`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_low',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_charging', 'battery_critical'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', 'in', botUuids)
        .where('chargebot_alert.name', '=', 'battery_low')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where(sql`chargebot_alert.timestamp > (select lbc.timestamp from last_battery_charging lbc where lbc.device_id = chargebot_alert.device_id)`)
        .where(sql`chargebot_alert.timestamp > (select bc.timestamp from battery_critical bc where bc.device_id = chargebot_alert.device_id)`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_temperature_critical',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_temperature_normalized'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', 'in', botUuids)
        .where('chargebot_alert.name', '=', 'battery_temperature_critical')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where(sql`chargebot_alert.timestamp > last_battery_temperature_normalized.timestamp`)
        .where(sql`chargebot_alert.timestamp > (select lbn.timestamp from last_battery_temperature_normalized lbn where lbn.device_id = chargebot_alert.device_id)`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_temperature_low',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_temperature_normalized', 'battery_temperature_critical'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', 'in', botUuids)
        .where('chargebot_alert.name', '=', 'battery_temperature_low')
        .where('chargebot_alert.timestamp', '>=', sql`date_trunc('day', NOW() - interval ${sql.lit(interval)})`)
        .where(sql`chargebot_alert.timestamp > (select lbn.timestamp from last_battery_temperature_normalized lbn where lbn.device_id = chargebot_alert.device_id)`)
        .where(sql`chargebot_alert.timestamp > (select bc.timestamp from battery_critical bc where bc.device_id = chargebot_alert.device_id)`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'all_alerts',
      (db) => db
        .selectFrom('battery_low')
        .select('device_id')
        .unionAll((eb) => eb.selectFrom('battery_critical').select('device_id'))
        .unionAll((eb) => eb.selectFrom('battery_temperature_low').select('device_id'))
        .unionAll((eb) => eb.selectFrom('battery_temperature_critical').select('device_id'))
    )
    .selectFrom('all_alerts')
    .select(({ fn }) => [
      fn.count<number>('device_id').as('value'),
    ])
    .executeTakeFirst()
    .catch(error => {
      console.log(error);
      throw error;
    });
    return count?.value ?? 0;
}