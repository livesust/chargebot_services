import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("bot_alert")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("message_displayed", "text")
    .addColumn("push_sent", "boolean")
    .addColumn("send_time", "timestamptz")
    .addColumn("display_time", "timestamptz")
    .addColumn("show", "boolean")
    .addColumn("dismissed", "boolean")
    .addColumn("active", "boolean")
    .addColumn("alert_count", "integer")
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
  await db.schema.dropTable("bot_alert").execute();
}