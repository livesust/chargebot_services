import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("app_install_permissions")
    .addColumn("app_install_id", "integer", (col) => col.references('app_install.id').onDelete('set null'))
    .addColumn("permission_id", "integer", (col) => col.references('permission.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("app_install_permissions")
    .dropColumn("app_install_id")
    .dropColumn("permission_id")
    .execute();
}