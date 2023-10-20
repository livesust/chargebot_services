import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("bot")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("device_uuid", "text", (col) => col.notNull().unique())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("initials", "varchar(2)", (col) => col.notNull())
    .addColumn("color", "varchar(100)", (col) => col.notNull())
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable("bot").execute();
}