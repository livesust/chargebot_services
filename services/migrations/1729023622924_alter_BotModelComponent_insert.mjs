import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  // PoC Bot Model Components
  await db.insertInto('bot_model_component')
    .values([
      {
        "bot_model_id": 1,
        "component_id": 1,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 1,
        "component_id": 2,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 1,
        "component_id": 3,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 1,
        "component_id": 4,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 1,
        "component_id": 6,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 1,
        "component_id": 7,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 1,
        "component_id": 9,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 1,
        "component_id": 11,
        "assignment_date": new Date()
      }
  ])
  .execute()

  // Trailblazer Bot Model Components
  await db.insertInto('bot_model_component')
    .values([
      {
        "bot_model_id": 2,
        "component_id": 1,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 2,
        "component_id": 2,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 2,
        "component_id": 3,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 2,
        "component_id": 5,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 2,
        "component_id": 6,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 2,
        "component_id": 7,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 2,
        "component_id": 8,
        "assignment_date": new Date()
      },
      {
        "bot_model_id": 2,
        "component_id": 10,
        "assignment_date": new Date()
      }
  ])
  .execute()
}

/**
 * @param db {Kysely<any>}
 */
export async function down(_) {
}