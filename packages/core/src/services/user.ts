export * as User from "./user";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
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

export function withPhone(eb: ExpressionBuilder<Database, 'user'>) {
    return jsonObjectFrom(
      eb.selectFrom('user_phone')
        .selectAll()
        .whereRef('user_phone.user_id', '=', 'user.id')
        .where('user_phone.deleted_by', 'is', null)
        .where('user_phone.primary', 'is', true)
        .limit(1)
    ).as('user_phone')
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
        .where('user.id', '=', id)
        .where('user.deleted_by', 'is', null)
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
        .where('user.id', '=', id)
        .where('user.deleted_by', 'is', null)
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
        .where('user.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<User[]> {
    return db
        .selectFrom("user")
        .selectAll()
        .select((eb) => withCompany(eb))
        .select((eb) => withEmail(eb))
        .select((eb) => withPhone(eb))
        .select((eb) => withRole(eb))
        .where('user.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<User>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("user").where('user.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('user.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<User>): Promise<User[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("user").where('user.deleted_by', 'is', null);
  return query
      .selectAll("user")
      .select((eb) => withCompany(eb))
      .select((eb) => withEmail(eb))
      .select((eb) => withPhone(eb))
      .select((eb) => withRole(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<User | undefined> {
    return db
        .selectFrom("user")
        .selectAll()
        .where('user.id', '=', id)
        .where('user.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<User | undefined> {
    return db
        .selectFrom("user")
        .selectAll()
        .select((eb) => withCompany(eb))
        .select((eb) => withEmail(eb))
        .select((eb) => withPhone(eb))
        .select((eb) => withRole(eb))
        .where('user.id', '=', id)
        .where('user.deleted_by', 'is', null)
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
  if (!email_address) return undefined;
  return db
      .selectFrom("user")
      .innerJoin('user_email', 'user_email.user_id', 'user.id')
      .where('user_email.email_address', '=', email_address)
      .where('user_email.deleted_by', 'is', null)
      .where('user.deleted_by', 'is', null)
      .selectAll('user')
      .executeTakeFirst();
}

export async function findByPhone(phone_number: string): Promise<User | undefined> {
  if (!phone_number) return undefined;
  return db
      .selectFrom("user")
      .innerJoin('user_phone', 'user_phone.user_id', 'user.id')
      .where('user_phone.phone_number', '=', phone_number)
      .where('user_phone.deleted_by', 'is', null)
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
  return buildSelectQuery(criteria)
    .selectAll("user")
    .select((eb) => withCompany(eb))
    .select((eb) => withEmail(eb))
    .select((eb) => withPhone(eb))
    .select((eb) => withRole(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<User>): Promise<User[]> {
  return buildSelectQuery(criteria)
    .selectAll("user")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<User>): Promise<User | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("user")
    .select((eb) => withCompany(eb))
    .select((eb) => withEmail(eb))
    .select((eb) => withPhone(eb))
    .select((eb) => withRole(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<User>): Promise<User | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("user")
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
  query = query.where('user.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  const email = Reflect.get(criteria, "email") as string;
  if (email) {
    query = query.innerJoin('user_email', 'user_email.user_id', 'user.id')
      .where('user_email.deleted_by', 'is', null)
      .where('user_email.primary', 'is', true)
      .where('user_email.email_address', 'like', `%${email}%`);
  }

  if (criteria.first_name !== undefined) {
    query = query.where(
      'user.first_name', 
      criteria.first_name === null ? 'is' : 'like', 
      criteria.first_name === null ? null : `%${ criteria.first_name }%`
    );
  }
  if (criteria.last_name !== undefined) {
    query = query.where(
      'user.last_name', 
      criteria.last_name === null ? 'is' : 'like', 
      criteria.last_name === null ? null : `%${ criteria.last_name }%`
    );
  }
  if (criteria.title !== undefined) {
    query = query.where(
      'user.title', 
      criteria.title === null ? 'is' : 'like', 
      criteria.title === null ? null : `%${ criteria.title }%`
    );
  }
  if (criteria.photo !== undefined) {
    query = query.where(
      'user.photo', 
      criteria.photo === null ? 'is' : 'like', 
      criteria.photo === null ? null : `%${ criteria.photo }%`
    );
  }
  if (criteria.invite_status !== undefined) {
    query = query.where(
      'user.invite_status', 
      criteria.invite_status === null ? 'is' : 'like', 
      criteria.invite_status === null ? null : `%${ criteria.invite_status }%`
    );
  }
  if (criteria.super_admin) {
    query = query.where('user.super_admin', '=', criteria.super_admin);
  }
  if (criteria.onboarding) {
    query = query.where('user.onboarding', '=', criteria.onboarding);
  }
  if (criteria.privacy_terms_last_accepted) {
    query = query.where('user.privacy_terms_last_accepted', '=', criteria.privacy_terms_last_accepted);
  }
  if (criteria.privacy_terms_version !== undefined) {
    query = query.where(
      'user.privacy_terms_version', 
      criteria.privacy_terms_version === null ? 'is' : 'like', 
      criteria.privacy_terms_version === null ? null : `%${ criteria.privacy_terms_version }%`
    );
  }
  if (criteria.user_id !== undefined) {
    query = query.where(
      'user.user_id', 
      criteria.user_id === null ? 'is' : 'like', 
      criteria.user_id === null ? null : `%${ criteria.user_id }%`
    );
  }

  if (criteria.company_id) {
    query = query.where('user.company_id', '=', criteria.company_id);
  }

  if (criteria.created_by) {
    query = query.where('user.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'user.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
