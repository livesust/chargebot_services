import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("outlet_type")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("type", "varchar(255)", (col) => col.notNull())
    .addColumn("outlet_amps", "float")
    .addColumn("outlet_volts", "float")
    .addColumn("connector", "varchar(100)")
    .addColumn("description", "text")
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
  await db.schema.dropTable("outlet_type").execute();
}