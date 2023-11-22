import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  await db.schema
    .createTable("outlet")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("pdu_outlet_number", "integer", (col) => col.notNull())
    .addColumn("notes", "text")
                .addColumn("outlet_type_id", "integer", (col) => col.references('outlet_type.id').onDelete('set null'))
    .addColumn("bot_id", "integer", (col) => col.references('bot.id').onDelete('set null'))
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
  await db.schema.dropTable("outlet").execute();
}