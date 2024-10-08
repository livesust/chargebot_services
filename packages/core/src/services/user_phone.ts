export * as UserPhone from "./user_phone";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { UserPhone, UserPhoneUpdate, NewUserPhone } from "../database/user_phone";

export function withUser(eb: ExpressionBuilder<Database, 'user_phone'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'user_phone.user_id')
        .where('user.deleted_by', 'is', null)
    ).as('user')
}


export async function create(user_phone: NewUserPhone): Promise<{
  entity: UserPhone | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('user_phone')
        .values({
            ...user_phone,
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

export async function update(id: number, user_phone: UserPhoneUpdate): Promise<{
  entity: UserPhone | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('user_phone')
        .set({
            ...user_phone,
        })
        .where('user_phone.id', '=', id)
        .where('user_phone.deleted_by', 'is', null)
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
  entity: UserPhone | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('user_phone')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('user_phone.id', '=', id)
        .where('user_phone.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<UserPhone>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('user_phone')
        .where('user_phone.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<UserPhone[]> {
    return db
        .selectFrom("user_phone")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withUser(eb))
        .where('user_phone.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<UserPhone>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("user_phone").where('user_phone.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('user_phone.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<UserPhone>): Promise<UserPhone[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("user_phone").where('user_phone.deleted_by', 'is', null);
  return query
      .selectAll("user_phone")
      // uncoment to enable eager loading
      //.select((eb) => withUser(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<UserPhone | undefined> {
    return db
        .selectFrom("user_phone")
        .selectAll()
        .where('user_phone.id', '=', id)
        .where('user_phone.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<UserPhone | undefined> {
    return db
        .selectFrom("user_phone")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withUser(eb))
        .where('user_phone.id', '=', id)
        .where('user_phone.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<UserPhone>): Promise<UserPhone[]> {
  return buildSelectQuery(criteria)
    .selectAll("user_phone")
    // uncoment to enable eager loading
    //.select((eb) => withUser(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<UserPhone>): Promise<UserPhone[]> {
  return buildSelectQuery(criteria)
    .selectAll("user_phone")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<UserPhone>): Promise<UserPhone | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("user_phone")
    // uncoment to enable eager loading
    //.select((eb) => withUser(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<UserPhone>): Promise<UserPhone | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("user_phone")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<UserPhone>) {
  let query = db.selectFrom('user_phone');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<UserPhone>) {
  let query = db.updateTable('user_phone');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<UserPhone>): any {
  query = query.where('user_phone.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.phone_number !== undefined) {
    query = query.where(
      'user_phone.phone_number', 
      criteria.phone_number === null ? 'is' : 'like', 
      criteria.phone_number === null ? null : `%${ criteria.phone_number }%`
    );
  }
  if (criteria.send_text) {
    query = query.where('user_phone.send_text', '=', criteria.send_text);
  }
  if (criteria.primary) {
    query = query.where('user_phone.primary', '=', criteria.primary);
  }

  if (criteria.user_id) {
    query = query.where('user_phone.user_id', '=', criteria.user_id);
  }

  if (criteria.created_by) {
    query = query.where('user_phone.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'user_phone.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
