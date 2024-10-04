export * as UserEmail from "./user_email";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { UserEmail, UserEmailUpdate, NewUserEmail } from "../database/user_email";

export function withUser(eb: ExpressionBuilder<Database, 'user_email'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'user_email.user_id')
        .where('user.deleted_by', 'is', null)
    ).as('user')
}


export async function create(user_email: NewUserEmail): Promise<{
  entity: UserEmail | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('user_email')
        .select(['user_email.id'])
        .where((eb) => eb.or([
            eb('user_email.email_address', '=', user_email.email_address),
        ]))
        .where('user_email.deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    const created = await db
        .insertInto('user_email')
        .values({
            ...user_email,
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

export async function update(id: number, user_email: UserEmailUpdate): Promise<{
  entity: UserEmail | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('user_email')
        .set({
            ...user_email,
        })
        .where('user_email.id', '=', id)
        .where('user_email.deleted_by', 'is', null)
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
  entity: UserEmail | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('user_email')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('user_email.id', '=', id)
        .where('user_email.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<UserEmail>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('user_email')
        .where('user_email.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<UserEmail[]> {
    return db
        .selectFrom("user_email")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withUser(eb))
        .where('user_email.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<UserEmail>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("user_email").where('user_email.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('user_email.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<UserEmail>): Promise<UserEmail[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("user_email").where('user_email.deleted_by', 'is', null);
  return query
      .selectAll("user_email")
      // uncoment to enable eager loading
      //.select((eb) => withUser(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<UserEmail | undefined> {
    return db
        .selectFrom("user_email")
        .selectAll()
        .where('user_email.id', '=', id)
        .where('user_email.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<UserEmail | undefined> {
    return db
        .selectFrom("user_email")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withUser(eb))
        .where('user_email.id', '=', id)
        .where('user_email.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<UserEmail>): Promise<UserEmail[]> {
  return buildSelectQuery(criteria)
    .selectAll("user_email")
    // uncoment to enable eager loading
    //.select((eb) => withUser(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<UserEmail>): Promise<UserEmail[]> {
  return buildSelectQuery(criteria)
    .selectAll("user_email")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<UserEmail>): Promise<UserEmail | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("user_email")
    // uncoment to enable eager loading
    //.select((eb) => withUser(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<UserEmail>): Promise<UserEmail | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("user_email")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<UserEmail>) {
  let query = db.selectFrom('user_email');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<UserEmail>) {
  let query = db.updateTable('user_email');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<UserEmail>): any {
  query = query.where('user_email.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.email_address !== undefined) {
    query = query.where(
      'user_email.email_address', 
      criteria.email_address === null ? 'is' : 'like', 
      criteria.email_address === null ? null : `%${ criteria.email_address }%`
    );
  }
  if (criteria.verified) {
    query = query.where('user_email.verified', '=', criteria.verified);
  }
  if (criteria.primary) {
    query = query.where('user_email.primary', '=', criteria.primary);
  }

  if (criteria.user_id) {
    query = query.where('user_email.user_id', '=', criteria.user_id);
  }

  if (criteria.created_by) {
    query = query.where('user_email.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'user_email.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
