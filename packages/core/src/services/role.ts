export * as Role from "./role";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db from '../database';
import { UpdateResult } from "kysely";
import { Role, RoleUpdate, NewRole } from "../database/role";


export async function create(role: NewRole): Promise<{
  entity: Role | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('role')
        .select(['role.id'])
        .where((eb) => eb.or([
            eb('role.role', '=', role.role),
        ]))
        .where('role.deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    const created = await db
        .insertInto('role')
        .values({
            ...role,
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

export async function update(id: number, role: RoleUpdate): Promise<{
  entity: Role | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('role')
        .set({
            ...role,
        })
        .where('role.id', '=', id)
        .where('role.deleted_by', 'is', null)
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
  entity: Role | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('role')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('role.id', '=', id)
        .where('role.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<Role>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('role')
        .where('role.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Role[]> {
    return db
        .selectFrom("role")
        .selectAll()
        .where('role.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<Role>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("role").where('role.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('role.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<Role>): Promise<Role[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("role").where('role.deleted_by', 'is', null);
  return query
      .selectAll("role")
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<Role | undefined> {
    return db
        .selectFrom("role")
        .selectAll()
        .where('role.id', '=', id)
        .where('role.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<Role | undefined> {
    return db
        .selectFrom("role")
        .selectAll()
        .where('role.id', '=', id)
        .where('role.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Role>): Promise<Role[]> {
  return buildSelectQuery(criteria)
    .selectAll("role")
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<Role>): Promise<Role[]> {
  return buildSelectQuery(criteria)
    .selectAll("role")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Role>): Promise<Role | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("role")
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<Role>): Promise<Role | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("role")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<Role>) {
  let query = db.selectFrom('role');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<Role>) {
  let query = db.updateTable('role');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<Role>): any {
  query = query.where('role.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.role !== undefined) {
    query = query.where(
      'role.role', 
      criteria.role === null ? 'is' : 'like', 
      criteria.role === null ? null : `%${ criteria.role }%`
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'role.description', 
      criteria.description === null ? 'is' : 'like', 
      criteria.description === null ? null : `%${ criteria.description }%`
    );
  }


  if (criteria.created_by) {
    query = query.where('role.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'role.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
