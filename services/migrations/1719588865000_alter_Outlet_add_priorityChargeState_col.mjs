import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("outlet")
    .addColumn("priority_charge_state", "varchar(255)", cd => cd.defaultTo("INACTIVE"))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("outlet")
    .dropColumn("priority_charge_state")
    .execute();
}