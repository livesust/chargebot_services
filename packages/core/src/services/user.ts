export * as User from "./user";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { DateTime } from "luxon";
import { User, UserUpdate, NewUser, UserInviteStatus } from "../database/user";

export function withCompany(eb: ExpressionBuilder<Database, 'user'>) {
    return jsonObjectFrom(
      eb.selectFrom('company')
        .selectAll()
        .whereRef('company.id', '=', 'user.company_id')
        .where('company.deleted_by', 'is', null)
    ).as('company')
}

export function withEmail(eb: ExpressionBuilder<Database, 'user'>) {
  return jsonObjectFrom(
    eb.selectFrom('user_email')
      .selectAll()
      .whereRef('user_email.user_id', '=', 'user.id')
      .where('user_email.deleted_by', 'is', null)
      .where('user_email.primary', 'is', true)
      .limit(1)
  ).as('user_email')
}

export function withRole(eb: ExpressionBuilder<Database, 'user'>) {
  return jsonObjectFrom(
    eb.selectFrom('role')
      .selectAll('role')
      .innerJoin('user_role', 'user_role.role_id', 'role.id')
      .whereRef('user_role.user_id', '=', 'user.id')
      .where('user_role.deleted_by', 'is', null)
      .where('role.deleted_by', 'is', null)
      .limit(1)
  ).as('role')
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

export async function update(id: number, user: UserUpdate): Promise<{
  entity: User | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('user')
        .set({
            ...user,
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

export async function remove(id: number, user_id: string): Promise<{
  entity: User | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('user')
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
    event: deleted
  };
}

export async function removeByCriteria(criteria: Partial<User>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('user')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<User[]> {
    return db
        .selectFrom("user")
        .selectAll()
        .select((eb) => withCompany(eb))
        .select((eb) => withEmail(eb))
        .select((eb) => withRole(eb))
        .where('deleted_by', 'is', null)
        .execute();
}

export async function paginate(page: number, pageSize: number): Promise<User[]> {
    return db
        .selectFrom("user")
        .selectAll()
        .select((eb) => withCompany(eb))
        .select((eb) => withEmail(eb))
        .select((eb) => withRole(eb))
        .where('deleted_by', 'is', null)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .execute();
}

export async function lazyGet(id: number): Promise<User | undefined> {
    return db
        .selectFrom("user")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<User | undefined> {
    return db
        .selectFrom("user")
        .selectAll()
        .select((eb) => withCompany(eb))
        .select((eb) => withEmail(eb))
        .select((eb) => withRole(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCognitoId(cognito_id: string): Promise<User | undefined> {
  return db
      .selectFrom("user")
      .selectAll()
      .where('user_id', '=', cognito_id)
      .where('deleted_by', 'is', null)
      .executeTakeFirst();
}

export async function findByEmail(email_address: string): Promise<User | undefined> {
  return db
      .selectFrom("user")
      .innerJoin('user_email', 'user_email.user_id', 'user.id')
      .where('user_email.email_address', '=', email_address)
      .where('user_email.deleted_by', 'is', null)
      .where('user.deleted_by', 'is', null)
      .selectAll('user')
      .executeTakeFirst();
}

export async function findExpired(days: number): Promise<User[] | undefined> {
  const dateLimit = DateTime.now().minus({days: days}).toJSDate();
  return db
      .selectFrom("user")
      .where('user.invite_status', '=', UserInviteStatus.INVITED)
      .where('user.created_date', '<=', dateLimit)
      .where('user.deleted_by', 'is', null)
      .selectAll()
      .execute();
}

export async function findByCriteria(criteria: Partial<User>): Promise<User[]> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withCompany(eb))
    .select((eb) => withEmail(eb))
    .select((eb) => withRole(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<User>): Promise<User[]> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<User>): Promise<User | undefined> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withCompany(eb))
    .select((eb) => withEmail(eb))
    .select((eb) => withRole(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<User>): Promise<User | undefined> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<User>) {
  let query = db.selectFrom('user');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<User>) {
  let query = db.updateTable('user');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<User>): any {
  query = query.where('deleted_by', 'is', null);

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
  if (criteria.invite_status !== undefined) {
    query = query.where(
      'invite_status', 
      criteria.invite_status === null ? 'is' : '=', 
      criteria.invite_status
    );
  }
  if (criteria.super_admin) {
    query = query.where('super_admin', '=', criteria.super_admin);
  }
  if (criteria.onboarding) {
    query = query.where('onboarding', '=', criteria.onboarding);
  }
  if (criteria.privacy_terms_last_accepted) {
    query = query.where('privacy_terms_last_accepted', '=', criteria.privacy_terms_last_accepted);
  }
  if (criteria.privacy_terms_version !== undefined) {
    query = query.where(
      'privacy_terms_version', 
      criteria.privacy_terms_version === null ? 'is' : '=', 
      criteria.privacy_terms_version
    );
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
