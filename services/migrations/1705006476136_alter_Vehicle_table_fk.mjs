import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("vehicle")
    .addColumn("vehicle_type_id", "integer", (col) => col.references('vehicle_type.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("vehicle")
    .dropColumn("vehicle_type_id")
    .execute();
}