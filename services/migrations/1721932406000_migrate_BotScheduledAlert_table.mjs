import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("bot_scheduled_alert")
    .addColumn("bot_id", "integer", (col) => col.references('bot.id').onDelete('set null'))
    .addColumn("scheduled_alert_id", "integer", (col) => col.references('scheduled_alert.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("bot_scheduled_alert")
    .dropColumn("bot_id")
    .dropColumn("scheduled_alert_id")
    .execute();
}