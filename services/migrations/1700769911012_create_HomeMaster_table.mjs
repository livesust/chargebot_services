import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("home_master")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("address_line_1", "text", (col) => col.notNull())
    .addColumn("address_line_2", "text")
    .addColumn("city", "varchar(100)", (col) => col.notNull())
    .addColumn("zip_code", "varchar(100)", (col) => col.notNull())
    .addColumn("latitude", "float", (col) => col.notNull())
    .addColumn("longitude", "float", (col) => col.notNull())
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
  await db.schema.dropTable("home_master").execute();
}