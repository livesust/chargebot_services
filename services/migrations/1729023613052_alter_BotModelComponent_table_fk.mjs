import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("bot_model_component")
    .addColumn("bot_model_id", "integer", (col) => col.references('bot_model.id').onDelete('set null'))
    .addColumn("component_id", "integer", (col) => col.references('component.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("bot_model_component")
    .dropColumn("bot_model_id")
    .dropColumn("component_id")
    .execute();
}