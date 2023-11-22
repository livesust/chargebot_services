import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  await db.schema
    .createTable("universal_app_settings")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("setting_value", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("app_settings_type_id", "integer", (col) => col.references('app_settings_type.id').onDelete('set null'))
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
  await db.schema.dropTable("universal_app_settings").execute();
}