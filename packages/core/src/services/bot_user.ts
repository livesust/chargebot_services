export * as BotUser from "./bot_user";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotUser, BotUserUpdate, NewBotUser } from "../database/bot_user";

export function withBot(eb: ExpressionBuilder<Database, 'bot_user'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_user.bot_id')
        .where('bot.deleted_by', 'is', null)
    ).as('bot')
}

export function withUser(eb: ExpressionBuilder<Database, 'bot_user'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'bot_user.user_id')
        .where('user.deleted_by', 'is', null)
    ).as('user')
}


export async function create(bot_user: NewBotUser): Promise<{
  entity: BotUser | undefined,
  event: unknown
} | undefined> {
    // check if many-to-many record already exists
    const existent = await db
          .selectFrom("bot_user")
          .selectAll()
          .where('bot_id', '=', bot_user.bot_id)
          .where('user_id', '=', bot_user.user_id)
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
        .insertInto('bot_user')
        .values({
            ...bot_user,
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

export async function update(id: number, bot_user: BotUserUpdate): Promise<{
  entity: BotUser | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot_user')
        .set({
            ...bot_user,
        })
        .where('bot_user.id', '=', id)
        .where('bot_user.deleted_by', 'is', null)
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
  entity: BotUser | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_user')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot_user.id', '=', id)
        .where('bot_user.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<BotUser>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot_user')
        .where('bot_user.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotUser[]> {
    return db
        .selectFrom("bot_user")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withUser(eb))
        .where('bot_user.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<BotUser>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_user").where('bot_user.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot_user.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<BotUser>): Promise<BotUser[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_user").where('bot_user.deleted_by', 'is', null);
  return query
      .selectAll("bot_user")
      .select((eb) => withBot(eb))
      .select((eb) => withUser(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<BotUser | undefined> {
    return db
        .selectFrom("bot_user")
        .selectAll()
        .where('bot_user.id', '=', id)
        .where('bot_user.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotUser | undefined> {
    return db
        .selectFrom("bot_user")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withUser(eb))
        .where('bot_user.id', '=', id)
        .where('bot_user.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotUser>): Promise<BotUser[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_user")
    .select((eb) => withBot(eb))
    .select((eb) => withUser(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotUser>): Promise<BotUser[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_user")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotUser>): Promise<BotUser | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_user")
    .select((eb) => withBot(eb))
    .select((eb) => withUser(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotUser>): Promise<BotUser | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_user")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<BotUser>) {
  let query = db.selectFrom('bot_user');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<BotUser>) {
  let query = db.updateTable('bot_user');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<BotUser>): any {
  query = query.where('bot_user.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.assignment_date) {
    query = query.where('bot_user.assignment_date', '=', criteria.assignment_date);
  }

  if (criteria.bot_id) {
    query = query.where('bot_user.bot_id', '=', criteria.bot_id);
  }

  if (criteria.user_id) {
    query = query.where('bot_user.user_id', '=', criteria.user_id);
  }

  if (criteria.created_by) {
    query = query.where('bot_user.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot_user.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
