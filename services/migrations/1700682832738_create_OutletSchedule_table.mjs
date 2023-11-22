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
    .createTable("outlet_schedule")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("day_of_week", sql`"DayOfWeek"`)
    .addColumn("all_day", "boolean")
                .addColumn("start_time", "timestamp", (col) => col.notNull())
    .addColumn("end_time", "timestamp", (col) => col.notNull())
    .addColumn("outlet_id", "integer", (col) => col.references('outlet.id').onDelete('set null'))
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
  await db.schema.dropTable("outlet_schedule").execute();
}