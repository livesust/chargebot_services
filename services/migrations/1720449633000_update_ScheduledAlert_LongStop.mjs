import { Kysely, sql } from "kysely";
/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.updateTable('scheduled_alert')
    .set({
      config_settings: null,
      description: 'This alert will send a notification if ChargeBot is parked for more than 4 hours.',
      modified_date: new Date(),
      modified_by: 'SYSTEM',
    })
    .where("id", "=", 5)
    .where("name", "=", "Long Stop")
    .execute();

  await db.updateTable('user_scheduled_alerts')
      .set({
        settings: null,
        modified_date: new Date(),
        modified_by: 'SYSTEM',
      })
      .where("scheduled_alert_id", "=", 5)
      .execute();

  await db.updateTable('scheduled_alert')
    .set({
      description: 'This alert will send a notification if ChargeBot battery is below 12%.',
      modified_date: new Date(),
      modified_by: 'SYSTEM',
    })
    .where("id", "=", 2)
    .where("name", "=", "Battery Low")
    .execute();

  await db.updateTable('scheduled_alert')
      .set({
        description: 'This alert will send a daily notification with kWh charged worth of batteries.',
        modified_date: new Date(),
        modified_by: 'SYSTEM',
      })
      .where("id", "=", 6)
      .where("name", "=", "Daily Use")
      .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down() {
}