import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("bot")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("bot_uuid", "text")
    .addColumn("initials", "varchar(2)", (col) => col.notNull())
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("pin_color", "varchar(100)")
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