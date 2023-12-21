export * as Permission from "./permission";
import db from '../database';
import { Permission, PermissionUpdate, NewPermission } from "../database/permission";


export async function create(permission: NewPermission): Promise<Permission | undefined> {
    const exists = await db
        .selectFrom('permission')
        .select(['id'])
        .where((eb) => eb.or([
            eb('permission_name', '=', permission.permission_name),
        ]))
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    return await db
        .insertInto('permission')
        .values({
            ...permission,
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, permission: PermissionUpdate): Promise<Permission | undefined> {
    return await db
        .updateTable('permission')
        .set(permission)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('permission')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('permission')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Permission[]> {
    return await db
        .selectFrom("permission")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<Permission | undefined> {
    return await db
        .selectFrom("permission")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Permission>): Promise<Permission[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Permission>): Promise<Permission | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<Permission>) {
  let query = db.selectFrom('permission').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.permission_name !== undefined) {
    query = query.where(
      'permission_name', 
      criteria.permission_name === null ? 'is' : '=', 
      criteria.permission_name
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'description', 
      criteria.description === null ? 'is' : '=', 
      criteria.description
    );
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
