import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createType("AlertPriority")
    .asEnum(["LOW","MEDIUM","HIGH",])
    .execute();

  await db.schema
    .createTable("alert_type")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("description", "text")
    .addColumn("priority", sql`"AlertPriority"`)
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