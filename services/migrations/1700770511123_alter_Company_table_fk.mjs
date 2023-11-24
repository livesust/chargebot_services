import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("company")
    .addColumn("customer_id", "integer", (col) => col.references('customer.id').onDelete('set null'))
    .addColumn("home_master_id", "integer", (col) => col.references('home_master.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("company")
    .dropColumn("customer_id")
    .dropColumn("home_master_id")
    .execute();
}