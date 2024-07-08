export * as ChargebotAlert from "./chargebot_alert";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotAlert } from "../../timescale/chargebot_alert";


export async function getWarningAlerts(bot_uuid: string): Promise<ChargebotAlert[] | undefined> {
  return db
    .with(
      'last_battery_charging',
      // Get the last report where vehicle was PARKED/AT_HOME
      (db) => db
        .selectFrom('chargebot_alert')
        .select(({ fn }) => [
          fn.max('timestamp').as('timestamp'),
        ])
        .where('device_id', '=', bot_uuid)
        .where('name', '=', 'battery_charging')
    )
    .with(
      'last_battery_temperature_normalized',
      // Get the last report where vehicle was PARKED/AT_HOME
      (db) => db
        .selectFrom('chargebot_alert')
        .select(({ fn }) => [
          fn.max('timestamp').as('timestamp'),
        ])
        .where('device_id', '=', bot_uuid)
        .where('name', '=', 'battery_temperature_normalized')
    )
    .with(
      'battery_critical',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_charging'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', '=', bot_uuid)
        .where('chargebot_alert.name', '=', 'battery_critical')
        .where(sql`chargebot_alert.timestamp > last_battery_charging.timestamp`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_low',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_charging', 'battery_critical'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', '=', bot_uuid)
        .where('chargebot_alert.name', '=', 'battery_low')
        .where(sql`chargebot_alert.timestamp > last_battery_charging.timestamp`)
        .where(sql`chargebot_alert.timestamp > battery_critical.timestamp`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_temperature_critical',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_temperature_normalized'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', '=', bot_uuid)
        .where('chargebot_alert.name', '=', 'battery_temperature_critical')
        .where(sql`chargebot_alert.timestamp > last_battery_temperature_normalized.timestamp`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .with(
      'battery_temperature_low',
      (db) => db
        .selectFrom(['chargebot_alert', 'last_battery_temperature_normalized', 'battery_temperature_critical'])
        .selectAll('chargebot_alert')
        .where('chargebot_alert.device_id', '=', bot_uuid)
        .where('chargebot_alert.name', '=', 'battery_temperature_low')
        .where(sql`chargebot_alert.timestamp > last_battery_temperature_normalized.timestamp`)
        .where(sql`chargebot_alert.timestamp > battery_temperature_critical.timestamp`)
        .orderBy('chargebot_alert.timestamp', 'desc')
        .limit(1)
    )
    .selectFrom('battery_low')
    .unionAll((eb) => eb.selectFrom('battery_critical').selectAll())
    .unionAll((eb) => eb.selectFrom('battery_temperature_low').selectAll())
    .unionAll((eb) => eb.selectFrom('battery_temperature_critical').selectAll())
    .selectAll()
    .execute()
}
