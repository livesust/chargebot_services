import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("bot_alert")
    .addColumn("alert_type_id", "integer", (col) => col.references('alert_type.id').onDelete('set null'))
    .addColumn("bot_id", "integer", (col) => col.references('bot.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("bot_alert")
    .dropColumn("alert_type_id")
    .dropColumn("bot_id")
    .execute();
}