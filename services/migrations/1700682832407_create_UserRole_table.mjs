import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  await db.schema
    .createTable("user_role")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("all_bots", "boolean")
                .addColumn("user_id", "integer", (col) => col.references('user.id').onDelete('set null'))
    .addColumn("role_id", "integer", (col) => col.references('role.id').onDelete('set null'))
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
  await db.schema.dropTable("user_role").execute();
}