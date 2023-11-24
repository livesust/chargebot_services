import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("outlet_equipment")
    .addColumn("equipment_id", "integer", (col) => col.references('equipment.id').onDelete('set null'))
    .addColumn("outlet_id", "integer", (col) => col.references('outlet.id').onDelete('set null'))
    .addColumn("user_id", "integer", (col) => col.references('user.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("outlet_equipment")
    .dropColumn("equipment_id")
    .dropColumn("outlet_id")
    .dropColumn("user_id")
    .execute();
}