export * as UserEmail from "./user_email";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { UserEmail, UserEmailUpdate, NewUserEmail } from "../database/user_email";

function withUser(eb: ExpressionBuilder<Database, 'user_email'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'user_email.user_id')
    ).as('user')
}


export async function create(user_email: NewUserEmail): Promise<{
  entity: UserEmail | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('user_email')
        .select(['id'])
        .where((eb) => eb.or([
            eb('email_address', '=', user_email.email_address),
        ]))
        .where('deleted_by', 'is', null)
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
        .set(user_email)
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

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('user_email')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('user_email')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<UserEmail[]> {
    return await db
        .selectFrom("user_email")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<UserEmail | undefined> {
    return await db
        .selectFrom("user_email")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withUser(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<UserEmail>): Promise<UserEmail[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    // uncoment to enable eager loading
    //.select((eb) => withUser(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<UserEmail>): Promise<UserEmail | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    // uncoment to enable eager loading
    //.select((eb) => withUser(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<UserEmail>) {
  let query = db.selectFrom('user_email').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.email_address !== undefined) {
    query = query.where(
      'email_address', 
      criteria.email_address === null ? 'is' : '=', 
      criteria.email_address
    );
  }
  if (criteria.verified) {
    query = query.where('verified', '=', criteria.verified);
  }
  if (criteria.primary) {
    query = query.where('primary', '=', criteria.primary);
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
