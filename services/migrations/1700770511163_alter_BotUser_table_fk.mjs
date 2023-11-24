import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("bot_user")
    .addColumn("bot_id", "integer", (col) => col.references('bot.id').onDelete('set null'))
    .addColumn("user_id", "integer", (col) => col.references('user.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("bot_user")
    .dropColumn("bot_id")
    .dropColumn("user_id")
    .execute();
}