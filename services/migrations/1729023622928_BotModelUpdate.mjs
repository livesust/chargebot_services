import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("bot")
    .addColumn("bot_model_id", "integer", (col) => col.references('bot_model.id').onDelete('set null'))
    .execute();
  await db.updateTable("bot").set({bot_model_id: 2}).execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(_) {
}