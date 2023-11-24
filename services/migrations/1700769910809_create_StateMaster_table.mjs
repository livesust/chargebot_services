import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("state_master")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(100)")
    .addColumn("abbreviation", "varchar(45)")
    .addColumn("country", "varchar(255)", (col) => col.notNull())
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
  await db.schema.dropTable("state_master").execute();
}