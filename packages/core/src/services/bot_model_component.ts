export * as BotModelComponent from "./bot_model_component";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotModelComponent, BotModelComponentUpdate, NewBotModelComponent } from "../database/bot_model_component";

export function withBotModel(eb: ExpressionBuilder<Database, 'bot_model_component'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot_model')
        .selectAll()
        .whereRef('bot_model.id', '=', 'bot_model_component.bot_model_id')
        .where('bot_model.deleted_by', 'is', null)
    ).as('bot_model')
}

export function withComponent(eb: ExpressionBuilder<Database, 'bot_model_component'>) {
    return jsonObjectFrom(
      eb.selectFrom('component')
        .selectAll()
        .whereRef('component.id', '=', 'bot_model_component.component_id')
        .where('component.deleted_by', 'is', null)
    ).as('component')
}


export async function create(bot_model_component: NewBotModelComponent): Promise<{
  entity: BotModelComponent | undefined,
  event: unknown
} | undefined> {
    // check if many-to-many record already exists
    const existent = await db
          .selectFrom("bot_model_component")
          .selectAll()
          .where('bot_model_id', '=', bot_model_component.bot_model_id)
          .where('component_id', '=', bot_model_component.component_id)
          .where('deleted_by', 'is', null)
          .executeTakeFirst();
    if (existent) {
        // return existent many-to-many record, do not create a new one
        return {
          entity: existent,
          // event to dispatch on EventBus on creation
          // undefined when entity already exists
          event: undefined
        };
    }
    const created = await db
        .insertInto('bot_model_component')
        .values({
            ...bot_model_component,
        })
        .returningAll()
        .executeTakeFirst();
    
    if (!created) {
      return undefined;
    }

    return {
      entity: created,
      // event to dispatch on EventBus on creation
      // undefined as default to not dispatch any event
      event: undefined
    };
}

export async function update(id: number, bot_model_component: BotModelComponentUpdate): Promise<{
  entity: BotModelComponent | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot_model_component')
        .set({
            ...bot_model_component,
        })
        .where('bot_model_component.id', '=', id)
        .where('bot_model_component.deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();

    if (!updated) {
      return undefined;
    }

    return {
      entity: updated,
      // event to dispatch on EventBus on creation
      // undefined as default to not dispatch any event
      event: undefined
    };
}

export async function remove(id: number, user_id: string): Promise<{
  entity: BotModelComponent | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_model_component')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot_model_component.id', '=', id)
        .where('bot_model_component.deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();

  if (!deleted) {
    return undefined;
  }

  return {
    entity: deleted,
    // event to dispatch on EventBus on creation
    // undefined as default to not dispatch any event
    event: undefined
  };
}

export async function removeByCriteria(criteria: Partial<BotModelComponent>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot_model_component')
        .where('bot_model_component.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotModelComponent[]> {
    return db
        .selectFrom("bot_model_component")
        .selectAll()
        .select((eb) => withBotModel(eb))
        .select((eb) => withComponent(eb))
        .where('bot_model_component.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<BotModelComponent>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_model_component").where('bot_model_component.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot_model_component.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<BotModelComponent>): Promise<BotModelComponent[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_model_component").where('bot_model_component.deleted_by', 'is', null);
  return query
      .selectAll("bot_model_component")
      .select((eb) => withBotModel(eb))
      .select((eb) => withComponent(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<BotModelComponent | undefined> {
    return db
        .selectFrom("bot_model_component")
        .selectAll()
        .where('bot_model_component.id', '=', id)
        .where('bot_model_component.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotModelComponent | undefined> {
    return db
        .selectFrom("bot_model_component")
        .selectAll()
        .select((eb) => withBotModel(eb))
        .select((eb) => withComponent(eb))
        .where('bot_model_component.id', '=', id)
        .where('bot_model_component.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotModelComponent>): Promise<BotModelComponent[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_model_component")
    .select((eb) => withBotModel(eb))
    .select((eb) => withComponent(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotModelComponent>): Promise<BotModelComponent[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_model_component")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotModelComponent>): Promise<BotModelComponent | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_model_component")
    .select((eb) => withBotModel(eb))
    .select((eb) => withComponent(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotModelComponent>): Promise<BotModelComponent | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_model_component")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<BotModelComponent>) {
  let query = db.selectFrom('bot_model_component');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<BotModelComponent>) {
  let query = db.updateTable('bot_model_component');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<BotModelComponent>): any {
  query = query.where('bot_model_component.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.assignment_date) {
    query = query.where('bot_model_component.assignment_date', '=', criteria.assignment_date);
  }

  if (criteria.bot_model_id) {
    query = query.where('bot_model_component.bot_model_id', '=', criteria.bot_model_id);
  }

  if (criteria.component_id) {
    query = query.where('bot_model_component.component_id', '=', criteria.component_id);
  }

  if (criteria.created_by) {
    query = query.where('bot_model_component.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot_model_component.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
