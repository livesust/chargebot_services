import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("home_master")
    .alterColumn("zip_code", (col) => col.dropNotNull())
    .addColumn("place_id", "text")
    .execute();
  await db.schema
    .alterTable("state_master")
    .alterColumn("abbreviation", (col) => col.dropNotNull())
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("home_master")
    .alterColumn("zip_code", (col) => col.setNotNull())
    .dropColumn("place_id")
    .execute();
  await db.schema
    .alterTable("state_master")
    .alterColumn("abbreviation", (col) => col.setNotNull())
    .execute();
}