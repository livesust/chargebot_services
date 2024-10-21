import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("bot_component_attribute")
    .addColumn("bot_id", "integer", (col) => col.references('bot.id').onDelete('set null'))
    .addColumn("component_attribute_id", "integer", (col) => col.references('component_attribute.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("bot_component_attribute")
    .dropColumn("bot_id")
    .dropColumn("component_attribute_id")
    .execute();
}