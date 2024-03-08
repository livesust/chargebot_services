import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("app_install")
    .addColumn("push_token", "text")
    .addColumn("app_platform_id", "text")
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("app_install")
    .dropColumn("push_token")
    .dropColumn("app_platform_id")
    .execute();
}