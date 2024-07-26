import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  const scheduledAlerts = await db.selectFrom('scheduled_alert')
    .selectAll()
    .where('deleted_by', 'is', null)
    .execute();

  const bots = await db.selectFrom('bot')
    .selectAll()
    .where('deleted_by', 'is', null)
    .execute();

  const audit = {
    created_date: new Date(),
    created_by: 'SYSTEM',
    modified_date: new Date(),
    modified_by: 'SYSTEM',
  };

  for (const bot of bots) {
    for (const alert of scheduledAlerts) {
      const scheduled = {
        alert_status: true,
        bot_id: bot.id,
        scheduled_alert_id: alert.id,
        settings: alert.config_settings ? Object.keys(alert.config_settings).reduce((acc, key) => {
          acc[key] = alert.config_settings[key].default;
          return acc;
        }, {}) : undefined,
        ...audit
      };
      await db.insertInto('bot_scheduled_alert')
        .values({
          ...scheduled,
          settings: scheduled.settings ? sql`CAST(${JSON.stringify(scheduled.settings)} AS JSONB)` : undefined
        })
        .execute()
    }
  }
  await db.schema.dropTable("user_scheduled_alerts").execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
}