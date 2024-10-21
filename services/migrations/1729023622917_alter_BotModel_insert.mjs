import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.insertInto('bot_model')
    .values([
      {
        "id": 1,
        "name": "PoC",
        "version": "v0.1",
        "release_date": new Date(2024, 0, 1)
      },
      {
        "id": 2,
        "name": "Trailblazer",
        "version": "v1.0",
        "release_date": new Date(2024, 8, 1)
      }
  ])
  .execute()
}

/**
 * @param db {Kysely<any>}
 */
export async function down(_) {
}