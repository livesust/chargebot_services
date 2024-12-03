import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("bot")
    .addColumn("bot_status_id", "integer", (col) => col.references('bot_status.id').onDelete('set null'))
    .execute();
    await db.updateTable("bot").set({bot_status_id: 1}).execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(_) {
}