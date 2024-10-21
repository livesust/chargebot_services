import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema.dropTable("bot_component").execute();
  await db.schema.dropTable("bot_firmware").execute();

  await db
    .insertInto("bot_firmware_version")
    .columns([
      "id",
      "version_number",
      "version_name",
      "notes",
      "active_date",
      "created_date",
      "created_by", 
      "modified_date",
      "modified_by",
      "deleted_date",
      "deleted_by"
    ])
    .expression(db => db.selectFrom("bot_version")
      .select([
        "id",
        "version_number",
        "version_name",
        "notes",
        "active_date",
        "created_date",
        "created_by", 
        "modified_date",
        "modified_by",
        "deleted_date",
        "deleted_by"
      ])
    ).execute();

    await db.schema
      .alterTable("bot")
      .dropColumn("bot_version_id")
      .execute();

  await db.schema.dropTable("bot_version").execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(_) {
}