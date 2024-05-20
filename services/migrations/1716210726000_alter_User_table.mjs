import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable("user")
    .addColumn("onboarding", "boolean")
    .addColumn("privacy_terms_last_accepted", "timestamptz")
    .addColumn("privacy_terms_version", "varchar(100)")
    .alterColumn("invite_status", (col) => col.setDataType("varchar(100)"))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
  .alterTable("user")
  .dropColumn("onboarding")
  .dropColumn("privacy_terms_last_accepted")
  .dropColumn("privacy_terms_version")
  .alterColumn("invite_status", (col) => col.setDataType("varchar(255)"))
  .execute();
}