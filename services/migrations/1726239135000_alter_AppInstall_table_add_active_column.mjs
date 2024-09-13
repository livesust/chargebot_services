import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("app_install")
    .addColumn("active", "boolean")
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("app_install")
    .dropColumn("active")
    .execute();
}