import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  await db.schema
    .createTable("user_phone")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("phone_number", "text", (col) => col.notNull().unique())
    .addColumn("send_text", "boolean")
                .addColumn("primary", "boolean")
                .addColumn("user_id", "integer", (col) => col.references('user.id').onDelete('set null'))
    .addColumn("created_date", "timestamp")
    .addColumn("created_by", "varchar(255)")
    .addColumn("modified_date", "timestamp")
    .addColumn("modified_by", "varchar(255)")
    .addColumn("deleted_date", "timestamp")
    .addColumn("deleted_by", "varchar(255)")
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable("user_phone").execute();
}