import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("user")
    .alterColumn("first_name", (col) => col.dropNotNull())
    .alterColumn("last_name", (col) => col.dropNotNull())
    .alterColumn("invite_status", (col) => col.setDataType("varchar(255)"))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
  .alterTable("user")
  .alterColumn("first_name", (col) => col.setNotNull())
  .alterColumn("last_name", (col) => col.setNotNull())
  .alterColumn("invite_status", (col) => col.setDataType("integer"))
  .execute();
}