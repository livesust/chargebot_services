import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("bot_company")
    .addColumn("bot_id", "integer", (col) => col.references('bot.id').onDelete('set null'))
    .addColumn("company_id", "integer", (col) => col.references('company.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("bot_company")
    .dropColumn("bot_id")
    .dropColumn("company_id")
    .execute();
}