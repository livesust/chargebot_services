import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("equipment")
    .addColumn("equipment_type_id", "integer", (col) => col.references('equipment_type.id').onDelete('set null'))
    .addColumn("customer_id", "integer", (col) => col.references('customer.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("equipment")
    .dropColumn("equipment_type_id")
    .dropColumn("customer_id")
    .execute();
}