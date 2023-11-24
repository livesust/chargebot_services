import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("bot")
    .addColumn("bot_version_id", "integer", (col) => col.references('bot_version.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("bot")
    .dropColumn("bot_version_id")
    .execute();
}