export * as BotUser from "./bot_user";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotUser, BotUserUpdate, NewBotUser } from "../database/bot_user";
import { withEmail, withRole } from "./user";

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
        .select((eb) => withEmail(eb))
        .select((eb) => withRole(eb))
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
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
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

export async function removeByUser(user_id: number, deleted_by_id: string): Promise<{
  entity: BotUser | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_user')
        .set({ deleted_date: new Date(), deleted_by: deleted_by_id })
        .where('user_id', '=', user_id)
        .where('deleted_by', 'is', null)
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

export async function remove(id: number, user_id: string): Promise<{
  entity: BotUser | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_user')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
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
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotUser[]> {
    return db
        .selectFrom("bot_user")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withUser(eb))
        .where('deleted_by', 'is', null)
        .execute();
}

export async function count(): Promise<number> {
  const count: { value: number; } | undefined = await db
        .selectFrom("bot_user")
        .select(({ fn }) => [
          fn.count<number>('id').as('value'),
        ])
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number): Promise<BotUser[]> {
    return db
        .selectFrom("bot_user")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withUser(eb))
        .where('deleted_by', 'is', null)
        .limit(pageSize)
        .offset(page * pageSize)
        .execute();
}

export async function lazyGet(id: number): Promise<BotUser | undefined> {
    return db
        .selectFrom("bot_user")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotUser | undefined> {
    return db
        .selectFrom("bot_user")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withUser(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function getUsersToNotify(botIds: number[]): Promise<BotUser[] | undefined> {
    return await db
        .selectFrom("bot_user")
        .innerJoin('user', 'user.id', 'bot_user.user_id')
        .innerJoin('bot', 'bot.id', 'bot_user.bot_id')
        .selectAll('bot_user')
        .select((eb) => withBot(eb))
        .select((eb) => withUser(eb))
        .where('bot_user.bot_id', 'in', botIds)
        .where('bot_user.deleted_by', 'is', null)
        .where('user.deleted_by', 'is', null)
        .where('bot.deleted_by', 'is', null)
        .execute();
}

export async function findByCriteria(criteria: Partial<BotUser>): Promise<BotUser[]> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withBot(eb))
    .select((eb) => withUser(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotUser>): Promise<BotUser[]> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotUser>): Promise<BotUser | undefined> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withBot(eb))
    .select((eb) => withUser(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotUser>): Promise<BotUser | undefined> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
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
  query = query.where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.assignment_date) {
    query = query.where('assignment_date', '=', criteria.assignment_date);
  }

  if (criteria.bot_id) {
    query = query.where('bot_id', '=', criteria.bot_id);
  }

  if (criteria.user_id) {
    query = query.where('user_id', '=', criteria.user_id);
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
