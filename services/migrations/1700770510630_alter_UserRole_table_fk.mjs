import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("user_role")
    .addColumn("user_id", "integer", (col) => col.references('user.id').onDelete('set null'))
    .addColumn("role_id", "integer", (col) => col.references('role.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("user_role")
    .dropColumn("user_id")
    .dropColumn("role_id")
    .execute();
}