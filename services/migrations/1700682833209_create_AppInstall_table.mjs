import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  await db.schema
    .createTable("app_install")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("app_version", "varchar(255)", (col) => col.notNull())
    .addColumn("platform", "varchar(100)", (col) => col.notNull())
    .addColumn("os_version", "varchar(100)", (col) => col.notNull())
    .addColumn("description", "text")
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
  await db.schema.dropTable("app_install").execute();
}