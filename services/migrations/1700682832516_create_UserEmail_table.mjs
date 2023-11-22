import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  await db.schema
    .createTable("user_email")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("email_address", "text", (col) => col.notNull().unique())
    .addColumn("verified", "boolean")
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
  await db.schema.dropTable("user_email").execute();
}