export * as BotComponent from "./bot_component";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotComponent, BotComponentUpdate, NewBotComponent } from "../database/bot_component";

export function withBot(eb: ExpressionBuilder<Database, 'bot_component'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_component.bot_id')
        .where('bot.deleted_by', 'is', null)
    ).as('bot')
}

export function withComponent(eb: ExpressionBuilder<Database, 'bot_component'>) {
    return jsonObjectFrom(
      eb.selectFrom('component')
        .selectAll()
        .whereRef('component.id', '=', 'bot_component.component_id')
        .where('component.deleted_by', 'is', null)
    ).as('component')
}


export async function create(bot_component: NewBotComponent): Promise<{
  entity: BotComponent | undefined,
  event: unknown
} | undefined> {
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
        return {
          entity: existent,
          // event to dispatch on EventBus on creation
          // undefined when entity already exists
          event: undefined
        };
    }
    const created = await db
        .insertInto('bot_component')
        .values({
            ...bot_component,
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

export async function update(id: number, bot_component: BotComponentUpdate): Promise<{
  entity: BotComponent | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot_component')
        .set({
            ...bot_component,
        })
        .where('bot_component.id', '=', id)
        .where('bot_component.deleted_by', 'is', null)
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
  entity: BotComponent | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_component')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot_component.id', '=', id)
        .where('bot_component.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<BotComponent>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot_component')
        .where('bot_component.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotComponent[]> {
    return db
        .selectFrom("bot_component")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withComponent(eb))
        .where('bot_component.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<BotComponent>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_component").where('bot_component.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot_component.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<BotComponent>): Promise<BotComponent[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_component").where('bot_component.deleted_by', 'is', null);
  return query
      .selectAll("bot_component")
      .select((eb) => withBot(eb))
      .select((eb) => withComponent(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<BotComponent | undefined> {
    return db
        .selectFrom("bot_component")
        .selectAll()
        .where('bot_component.id', '=', id)
        .where('bot_component.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotComponent | undefined> {
    return db
        .selectFrom("bot_component")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withComponent(eb))
        .where('bot_component.id', '=', id)
        .where('bot_component.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotComponent>): Promise<BotComponent[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_component")
    .select((eb) => withBot(eb))
    .select((eb) => withComponent(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotComponent>): Promise<BotComponent[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_component")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotComponent>): Promise<BotComponent | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_component")
    .select((eb) => withBot(eb))
    .select((eb) => withComponent(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotComponent>): Promise<BotComponent | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_component")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<BotComponent>) {
  let query = db.selectFrom('bot_component');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<BotComponent>) {
  let query = db.updateTable('bot_component');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<BotComponent>): any {
  query = query.where('bot_component.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.install_date) {
    query = query.where('bot_component.install_date', '=', criteria.install_date);
  }
  if (criteria.component_serial !== undefined) {
    query = query.where(
      'bot_component.component_serial', 
      criteria.component_serial === null ? 'is' : 'like', 
      criteria.component_serial === null ? null : `%${ criteria.component_serial }%`
    );
  }

  if (criteria.bot_id) {
    query = query.where('bot_component.bot_id', '=', criteria.bot_id);
  }

  if (criteria.component_id) {
    query = query.where('bot_component.component_id', '=', criteria.component_id);
  }

  if (criteria.created_by) {
    query = query.where('bot_component.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot_component.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
