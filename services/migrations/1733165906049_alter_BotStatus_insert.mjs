import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.insertInto('bot_status')
    .values([
      {
        "id": 1,
        "name": "Arrived Facility",
      },
      {
        "id": 2,
        "name": "Assembled",
      },
      {
        "id": 3,
        "name": "Tested",
      },
      {
        "id": 4,
        "name": "Packaged",
      },
      {
        "id": 5,
        "name": "Shipped",
      },
      {
        "id": 6,
        "name": "Delivered",
      },
      {
        "id": 7,
        "name": "Deployed",
      },
      {
        "id": 8,
        "name": "Returned",
      },
      {
        "id": 9,
        "name": "Decomissioned",
      }
  ])
  .execute()
}

/**
 * @param db {Kysely<any>}
 */
export async function down(_) {
}