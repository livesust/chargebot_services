import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("permission")
    .renameColumn("permission_name", "name")
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
  .alterTable("permission")
  .renameColumn("name", "permission_name")
  .execute();
}