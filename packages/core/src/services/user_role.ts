export * as UserRole from "./user_role";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { UserRole, UserRoleUpdate, NewUserRole } from "../database/user_role";

export function withUser(eb: ExpressionBuilder<Database, 'user_role'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'user_role.user_id')
        .where('user.deleted_by', 'is', null)
    ).as('user')
}

export function withRole(eb: ExpressionBuilder<Database, 'user_role'>) {
    return jsonObjectFrom(
      eb.selectFrom('role')
        .selectAll()
        .whereRef('role.id', '=', 'user_role.role_id')
        .where('role.deleted_by', 'is', null)
    ).as('role')
}


export async function create(user_role: NewUserRole): Promise<{
  entity: UserRole | undefined,
  event: unknown
} | undefined> {
    // check if many-to-many record already exists
    const existent = await db
          .selectFrom("user_role")
          .selectAll()
          .where('user_id', '=', user_role.user_id)
          .where('role_id', '=', user_role.role_id)
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
        .insertInto('user_role')
        .values({
            ...user_role,
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

export async function update(id: number, user_role: UserRoleUpdate): Promise<{
  entity: UserRole | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('user_role')
        .set({
            ...user_role,
        })
        .where('user_role.id', '=', id)
        .where('user_role.deleted_by', 'is', null)
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
  entity: UserRole | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('user_role')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('user_role.id', '=', id)
        .where('user_role.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<UserRole>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('user_role')
        .where('user_role.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<UserRole[]> {
    return db
        .selectFrom("user_role")
        .selectAll()
        .select((eb) => withUser(eb))
        .select((eb) => withRole(eb))
        .where('user_role.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<UserRole>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("user_role").where('user_role.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('user_role.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<UserRole>): Promise<UserRole[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("user_role").where('user_role.deleted_by', 'is', null);
  return query
      .selectAll("user_role")
      .select((eb) => withUser(eb))
      .select((eb) => withRole(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<UserRole | undefined> {
    return db
        .selectFrom("user_role")
        .selectAll()
        .where('user_role.id', '=', id)
        .where('user_role.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<UserRole | undefined> {
    return db
        .selectFrom("user_role")
        .selectAll()
        .select((eb) => withUser(eb))
        .select((eb) => withRole(eb))
        .where('user_role.id', '=', id)
        .where('user_role.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<UserRole>): Promise<UserRole[]> {
  return buildSelectQuery(criteria)
    .selectAll("user_role")
    .select((eb) => withUser(eb))
    .select((eb) => withRole(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<UserRole>): Promise<UserRole[]> {
  return buildSelectQuery(criteria)
    .selectAll("user_role")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<UserRole>): Promise<UserRole | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("user_role")
    .select((eb) => withUser(eb))
    .select((eb) => withRole(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<UserRole>): Promise<UserRole | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("user_role")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<UserRole>) {
  let query = db.selectFrom('user_role');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<UserRole>) {
  let query = db.updateTable('user_role');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<UserRole>): any {
  query = query.where('user_role.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.all_bots) {
    query = query.where('user_role.all_bots', '=', criteria.all_bots);
  }

  if (criteria.user_id) {
    query = query.where('user_role.user_id', '=', criteria.user_id);
  }

  if (criteria.role_id) {
    query = query.where('user_role.role_id', '=', criteria.role_id);
  }

  if (criteria.created_by) {
    query = query.where('user_role.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'user_role.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
