import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.insertInto('component_attribute')
    .values([
      {
          "name": "IMEI",
          "type": "string",
          "component_id": 2
      },
      {
          "name": "LTE Provider",
          "type": "string",
          "component_id": 2
      },
  ])
  .execute()
}

/**
 * @param db {Kysely<any>}
 */
export async function down(_) {
}