import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("bot")
    .addColumn("attachments", "text[]")
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("bot")
    .dropColumn("attachments")
    .execute();
}