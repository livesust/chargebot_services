import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  await db.schema
    .createTable("equipment")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("brand", "varchar(255)")
                .addColumn("description", "text")
                .addColumn("voltage", "float")
                .addColumn("max_charging_amps", "float")
                .addColumn("equipment_type_id", "integer", (col) => col.references('equipment_type.id').onDelete('set null'))
    .addColumn("customer_id", "integer", (col) => col.references('customer.id').onDelete('set null'))
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
  await db.schema.dropTable("equipment").execute();
}