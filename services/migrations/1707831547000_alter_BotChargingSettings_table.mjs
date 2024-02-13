import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("bot_charging_settings")
    .alterColumn("day_of_week", (col) => col.setNotNull())
    .alterColumn("all_day", (col) => col.setNotNull())
    .alterColumn("start_time", (col) => col.dropNotNull())
    .alterColumn("end_time", (col) => col.dropNotNull())
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
  .alterTable("bot_charging_settings")
  .alterColumn("day_of_week", (col) => col.dropNotNull())
  .alterColumn("all_day", (col) => col.dropNotNull())
  .alterColumn("start_time", (col) => col.setNotNull())
  .alterColumn("end_time", (col) => col.setNotNull())
    .execute();
}