export * as User from "./user";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { User, UserUpdate, NewUser } from "../database/user";

function withCompany(eb: ExpressionBuilder<Database, 'user'>) {
    return jsonObjectFrom(
      eb.selectFrom('company')
        .selectAll()
        .whereRef('company.id', '=', 'user.company_id')
    ).as('company')
}


export async function create(user: NewUser): Promise<{
  entity: User | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('user')
        .values({
            ...user,
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

export async function update(id: number, user: UserUpdate): Promise<User | undefined> {
    return await db
        .updateTable('user')
        .set(user)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('user')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('user')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<User[]> {
    return await db
        .selectFrom("user")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<User | undefined> {
    return await db
        .selectFrom("user")
        .selectAll()
        .select((eb) => withCompany(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<User>): Promise<User[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withCompany(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<User>): Promise<User | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withCompany(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<User>) {
  let query = db.selectFrom('user').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.first_name !== undefined) {
    query = query.where(
      'first_name', 
      criteria.first_name === null ? 'is' : '=', 
      criteria.first_name
    );
  }
  if (criteria.last_name !== undefined) {
    query = query.where(
      'last_name', 
      criteria.last_name === null ? 'is' : '=', 
      criteria.last_name
    );
  }
  if (criteria.title !== undefined) {
    query = query.where(
      'title', 
      criteria.title === null ? 'is' : '=', 
      criteria.title
    );
  }
  if (criteria.photo !== undefined) {
    query = query.where(
      'photo', 
      criteria.photo === null ? 'is' : '=', 
      criteria.photo
    );
  }
  if (criteria.invite_status) {
    query = query.where('invite_status', '=', criteria.invite_status);
  }
  if (criteria.super_admin) {
    query = query.where('super_admin', '=', criteria.super_admin);
  }
  if (criteria.user_id !== undefined) {
    query = query.where(
      'user_id', 
      criteria.user_id === null ? 'is' : '=', 
      criteria.user_id
    );
  }

  if (criteria.company_id) {
    query = query.where('company_id', '=', criteria.company_id);
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
