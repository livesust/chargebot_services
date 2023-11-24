import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("bot_firmware")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("inverter_version", "varchar(255)", (col) => col.notNull())
    .addColumn("pi_version", "varchar(255)", (col) => col.notNull())
    .addColumn("firmware_version", "varchar(255)", (col) => col.notNull())
    .addColumn("battery_version", "varchar(255)", (col) => col.notNull())
    .addColumn("pdu_version", "varchar(255)", (col) => col.notNull())
    .addColumn("notes", "text")
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
  await db.schema.dropTable("bot_firmware").execute();
}