import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createType("DayOfWeek")
    .asEnum(["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY",])
    .execute();

  await db.schema
    .createTable("bot_charging_settings")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("day_of_week", sql`"DayOfWeek"`)
    .addColumn("all_day", "boolean")
                .addColumn("start_time", "timestamp", (col) => col.notNull())
    .addColumn("end_time", "timestamp", (col) => col.notNull())
    .addColumn("bot_id", "integer", (col) => col.references('bot.id').onDelete('set null'))
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