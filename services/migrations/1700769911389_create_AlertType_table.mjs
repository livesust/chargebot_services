import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("alert_type")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(255)")
    .addColumn("description", "text")
    .addColumn("priority", "varchar(255)")
    .addColumn("severity", "varchar(255)")
    .addColumn("color_code", "varchar(100)", (col) => col.notNull())
    .addColumn("send_push", "boolean")
    .addColumn("alert_text", "varchar(255)", (col) => col.notNull())
    .addColumn("alert_link", "text")
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
  await db.schema.dropTable("alert_type").execute();
}