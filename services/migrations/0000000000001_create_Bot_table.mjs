import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("bot")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("bot_uuid", "text", (col) => col.notNull().unique())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("initials", "varchar(10)", (col) => col.notNull())
    .addColumn("pin_color", "varchar(100)", (col) => col.notNull())
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
  await db.schema.dropTable("bot").execute();
}