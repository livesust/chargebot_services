export * as BotComponent from "./bot_component";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotComponent, BotComponentUpdate, NewBotComponent } from "../database/bot_component";

function withBot(eb: ExpressionBuilder<Database, 'bot_component'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_component.bot_id')
    ).as('bot')
}

function withComponent(eb: ExpressionBuilder<Database, 'bot_component'>) {
    return jsonObjectFrom(
      eb.selectFrom('component')
        .selectAll()
        .whereRef('component.id', '=', 'bot_component.component_id')
    ).as('component')
}


export async function create(bot_component: NewBotComponent): Promise<BotComponent | undefined> {
    // check if many-to-many record already exists
    const existent = await db
          .selectFrom("bot_component")
          .selectAll()
          .where('bot_id', '=', bot_component.bot_id)
          .where('component_id', '=', bot_component.component_id)
          .where('deleted_by', 'is', null)
          .executeTakeFirst();
    if (existent) {
        // return existent many-to-many record, do not create a new one
        return existent;
    }
    return await db
        .insertInto('bot_component')
        .values({
            ...bot_component,
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, bot_component: BotComponentUpdate): Promise<BotComponent | undefined> {
    return await db
        .updateTable('bot_component')
        .set(bot_component)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('bot_component')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('bot_component')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotComponent[]> {
    return await db
        .selectFrom("bot_component")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<BotComponent | undefined> {
    return await db
        .selectFrom("bot_component")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withComponent(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotComponent>): Promise<BotComponent[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withBot(eb))
    .select((eb) => withComponent(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotComponent>): Promise<BotComponent | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withBot(eb))
    .select((eb) => withComponent(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<BotComponent>) {
  let query = db.selectFrom('bot_component').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.install_date) {
    query = query.where('install_date', '=', criteria.install_date);
  }
  if (criteria.component_serial !== undefined) {
    query = query.where(
      'component_serial', 
      criteria.component_serial === null ? 'is' : '=', 
      criteria.component_serial
    );
  }

  if (criteria.bot_id) {
    query = query.where('bot_id', '=', criteria.bot_id);
  }

  if (criteria.component_id) {
    query = query.where('component_id', '=', criteria.component_id);
  }

  if (criteria.created_by) {
    query = query.where('created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
