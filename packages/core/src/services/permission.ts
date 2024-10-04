export * as Permission from "./permission";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db from '../database';
import { UpdateResult } from "kysely";
import { Permission, PermissionUpdate, NewPermission } from "../database/permission";


export async function create(permission: NewPermission): Promise<{
  entity: Permission | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('permission')
        .select(['permission.id'])
        .where((eb) => eb.or([
            eb('permission.name', '=', permission.name),
        ]))
        .where('permission.deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    const created = await db
        .insertInto('permission')
        .values({
            ...permission,
        })
        .returningAll()
        .executeTakeFirst();
    
    if (!created) {
      return undefined;
    }

    return {
      entity: created,
      event: created
    };
}

export async function update(id: number, permission: PermissionUpdate): Promise<{
  entity: Permission | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('permission')
        .set({
            ...permission,
        })
        .where('permission.id', '=', id)
        .where('permission.deleted_by', 'is', null)
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
  entity: Permission | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('permission')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('permission.id', '=', id)
        .where('permission.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<Permission>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('permission')
        .where('permission.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Permission[]> {
    return db
        .selectFrom("permission")
        .selectAll()
        .where('permission.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<Permission>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("permission").where('permission.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('permission.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<Permission>): Promise<Permission[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("permission").where('permission.deleted_by', 'is', null);
  return query
      .selectAll("permission")
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<Permission | undefined> {
    return db
        .selectFrom("permission")
        .selectAll()
        .where('permission.id', '=', id)
        .where('permission.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<Permission | undefined> {
    return db
        .selectFrom("permission")
        .selectAll()
        .where('permission.id', '=', id)
        .where('permission.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Permission>): Promise<Permission[]> {
  return buildSelectQuery(criteria)
    .selectAll("permission")
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<Permission>): Promise<Permission[]> {
  return buildSelectQuery(criteria)
    .selectAll("permission")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Permission>): Promise<Permission | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("permission")
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<Permission>): Promise<Permission | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("permission")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<Permission>) {
  let query = db.selectFrom('permission');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<Permission>) {
  let query = db.updateTable('permission');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<Permission>): any {
  query = query.where('permission.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.name !== undefined) {
    query = query.where(
      'permission.name', 
      criteria.name === null ? 'is' : 'like', 
      criteria.name === null ? null : `%${ criteria.name }%`
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'permission.description', 
      criteria.description === null ? 'is' : 'like', 
      criteria.description === null ? null : `%${ criteria.description }%`
    );
  }


  if (criteria.created_by) {
    query = query.where('permission.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'permission.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
