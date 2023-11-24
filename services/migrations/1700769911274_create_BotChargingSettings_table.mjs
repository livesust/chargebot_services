import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("bot_charging_settings")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("day_of_week", "varchar(255)")
    .addColumn("all_day", "boolean")
    .addColumn("start_time", "timestamp", (col) => col.notNull())
    .addColumn("end_time", "timestamp", (col) => col.notNull())
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
  await db.schema.dropTable("bot_charging_settings").execute();
}