import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("bot_firmware_install")
    .addColumn("bot_id", "integer", (col) => col.references('bot.id').onDelete('set null'))
    .addColumn("bot_firmware_version_id", "integer", (col) => col.references('bot_firmware_version.id').onDelete('set null'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .alterTable("bot_firmware_install")
    .dropColumn("bot_id")
    .dropColumn("bot_firmware_version_id")
    .execute();
}