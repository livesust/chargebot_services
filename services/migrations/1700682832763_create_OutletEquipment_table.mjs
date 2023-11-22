import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  await db.schema
    .createTable("outlet_equipment")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("notes", "text")
                .addColumn("equipment_id", "integer", (col) => col.references('equipment.id').onDelete('set null'))
    .addColumn("outlet_id", "integer", (col) => col.references('outlet.id').onDelete('set null'))
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
  await db.schema.dropTable("outlet_equipment").execute();
}