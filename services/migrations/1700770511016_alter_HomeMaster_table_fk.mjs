import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("home_master")
    .addColumn("state_master_id", "integer", (col) => col.references('state_master.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("home_master")
    .dropColumn("state_master_id")
    .execute();
}