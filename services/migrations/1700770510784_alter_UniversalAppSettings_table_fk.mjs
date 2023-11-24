import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("universal_app_settings")
    .addColumn("app_settings_type_id", "integer", (col) => col.references('app_settings_type.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("universal_app_settings")
    .dropColumn("app_settings_type_id")
    .execute();
}