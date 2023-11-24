import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("bot_scheduled_alerts")
    .addColumn("scheduled_alert_id", "integer", (col) => col.references('scheduled_alert.id').onDelete('set null'))
    .addColumn("user_id", "integer", (col) => col.references('user.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("bot_scheduled_alerts")
    .dropColumn("scheduled_alert_id")
    .dropColumn("user_id")
    .execute();
}