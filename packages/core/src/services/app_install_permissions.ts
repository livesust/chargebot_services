export * as AppInstallPermissions from "./app_install_permissions";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { AppInstallPermissions, AppInstallPermissionsUpdate, NewAppInstallPermissions } from "../database/app_install_permissions";

function withAppInstall(eb: ExpressionBuilder<Database, 'app_install_permissions'>) {
    return jsonObjectFrom(
      eb.selectFrom('app_install')
        .selectAll()
        .whereRef('app_install.id', '=', 'app_install_permissions.app_install_id')
    ).as('app_install')
}

function withPermission(eb: ExpressionBuilder<Database, 'app_install_permissions'>) {
    return jsonObjectFrom(
      eb.selectFrom('permission')
        .selectAll()
        .whereRef('permission.id', '=', 'app_install_permissions.permission_id')
    ).as('permission')
}


export async function create(app_install_permissions: NewAppInstallPermissions): Promise<{
  entity: AppInstallPermissions | undefined,
  event: unknown
} | undefined> {
    // check if many-to-many record already exists
    const existent = await db
          .selectFrom("app_install_permissions")
          .selectAll()
          .where('app_install_id', '=', app_install_permissions.app_install_id)
          .where('permission_id', '=', app_install_permissions.permission_id)
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
        .insertInto('app_install_permissions')
        .values({
            ...app_install_permissions,
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

export async function update(id: number, app_install_permissions: AppInstallPermissionsUpdate): Promise<{
  entity: AppInstallPermissions | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('app_install_permissions')
        .set(app_install_permissions)
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
  entity: AppInstallPermissions | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('app_install_permissions')
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
    // event to dispatch on EventBus on creation
    // undefined as default to not dispatch any event
    event: undefined
  };
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('app_install_permissions')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<AppInstallPermissions[]> {
    return await db
        .selectFrom("app_install_permissions")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<AppInstallPermissions | undefined> {
    return await db
        .selectFrom("app_install_permissions")
        .selectAll()
        .select((eb) => withAppInstall(eb))
        .select((eb) => withPermission(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<AppInstallPermissions>): Promise<AppInstallPermissions[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withAppInstall(eb))
    .select((eb) => withPermission(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<AppInstallPermissions>): Promise<AppInstallPermissions | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withAppInstall(eb))
    .select((eb) => withPermission(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<AppInstallPermissions>) {
  let query = db.selectFrom('app_install_permissions').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.permission_status) {
    query = query.where('permission_status', '=', criteria.permission_status);
  }

  if (criteria.app_install_id) {
    query = query.where('app_install_id', '=', criteria.app_install_id);
  }

  if (criteria.permission_id) {
    query = query.where('permission_id', '=', criteria.permission_id);
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
