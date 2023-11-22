import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  await db.schema
    .createTable("app_install_permissions")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("permission_status", "boolean")
                .addColumn("app_install_id", "integer", (col) => col.references('app_install.id').onDelete('set null'))
    .addColumn("permission_id", "integer", (col) => col.references('permission.id').onDelete('set null'))
    .addColumn("created_date", "timestamp")
    .addColumn("created_by", "varchar(255)")
    .addColumn("modified_date", "timestamp")
    .addColumn("modified_by", "varchar(255)")
    .addColumn("deleted_date", "timestamp")
    .addColumn("deleted_by", "varchar(255)")
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable("app_install_permissions").execute();
}