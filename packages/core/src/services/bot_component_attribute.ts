export * as BotComponentAttribute from "./bot_component_attribute";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotComponentAttribute, BotComponentAttributeUpdate, NewBotComponentAttribute } from "../database/bot_component_attribute";

export function withBot(eb: ExpressionBuilder<Database, 'bot_component_attribute'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_component_attribute.bot_id')
        .where('bot.deleted_by', 'is', null)
    ).as('bot')
}

export function withComponentAttribute(eb: ExpressionBuilder<Database, 'bot_component_attribute'>) {
    return jsonObjectFrom(
      eb.selectFrom('component_attribute')
        .selectAll()
        .whereRef('component_attribute.id', '=', 'bot_component_attribute.component_attribute_id')
        .where('component_attribute.deleted_by', 'is', null)
    ).as('component_attribute')
}


export async function create(bot_component_attribute: NewBotComponentAttribute): Promise<{
  entity: BotComponentAttribute | undefined,
  event: unknown
} | undefined> {
    // check if many-to-many record already exists
    const existent = await db
          .selectFrom("bot_component_attribute")
          .selectAll()
          .where('bot_id', '=', bot_component_attribute.bot_id)
          .where('component_attribute_id', '=', bot_component_attribute.component_attribute_id)
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
        .insertInto('bot_component_attribute')
        .values({
            ...bot_component_attribute,
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

export async function update(id: number, bot_component_attribute: BotComponentAttributeUpdate): Promise<{
  entity: BotComponentAttribute | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot_component_attribute')
        .set({
            ...bot_component_attribute,
        })
        .where('bot_component_attribute.id', '=', id)
        .where('bot_component_attribute.deleted_by', 'is', null)
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
  entity: BotComponentAttribute | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_component_attribute')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot_component_attribute.id', '=', id)
        .where('bot_component_attribute.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<BotComponentAttribute>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot_component_attribute')
        .where('bot_component_attribute.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotComponentAttribute[]> {
    return db
        .selectFrom("bot_component_attribute")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withComponentAttribute(eb))
        .where('bot_component_attribute.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<BotComponentAttribute>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_component_attribute").where('bot_component_attribute.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot_component_attribute.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<BotComponentAttribute>): Promise<BotComponentAttribute[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_component_attribute").where('bot_component_attribute.deleted_by', 'is', null);
  return query
      .selectAll("bot_component_attribute")
      .select((eb) => withBot(eb))
      .select((eb) => withComponentAttribute(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<BotComponentAttribute | undefined> {
    return db
        .selectFrom("bot_component_attribute")
        .selectAll()
        .where('bot_component_attribute.id', '=', id)
        .where('bot_component_attribute.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotComponentAttribute | undefined> {
    return db
        .selectFrom("bot_component_attribute")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withComponentAttribute(eb))
        .where('bot_component_attribute.id', '=', id)
        .where('bot_component_attribute.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotComponentAttribute>): Promise<BotComponentAttribute[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_component_attribute")
    .select((eb) => withBot(eb))
    .select((eb) => withComponentAttribute(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotComponentAttribute>): Promise<BotComponentAttribute[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_component_attribute")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotComponentAttribute>): Promise<BotComponentAttribute | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_component_attribute")
    .select((eb) => withBot(eb))
    .select((eb) => withComponentAttribute(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotComponentAttribute>): Promise<BotComponentAttribute | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_component_attribute")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<BotComponentAttribute>) {
  let query = db.selectFrom('bot_component_attribute');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<BotComponentAttribute>) {
  let query = db.updateTable('bot_component_attribute');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<BotComponentAttribute>): any {
  query = query.where('bot_component_attribute.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.value !== undefined) {
    query = query.where(
      'bot_component_attribute.value', 
      criteria.value === null ? 'is' : 'like', 
      criteria.value === null ? null : `%${ criteria.value }%`
    );
  }

  if (criteria.bot_id) {
    query = query.where('bot_component_attribute.bot_id', '=', criteria.bot_id);
  }

  if (criteria.component_attribute_id) {
    query = query.where('bot_component_attribute.component_attribute_id', '=', criteria.component_attribute_id);
  }

  if (criteria.created_by) {
    query = query.where('bot_component_attribute.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot_component_attribute.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
