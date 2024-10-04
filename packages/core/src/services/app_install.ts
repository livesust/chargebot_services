export * as AppInstall from "./app_install";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { AppInstall, AppInstallUpdate, NewAppInstall } from "../database/app_install";
import { PermissionName } from "../database/permission";

export function withUser(eb: ExpressionBuilder<Database, 'app_install'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'app_install.user_id')
        .where('user.deleted_by', 'is', null)
    ).as('user')
}


export async function create(app_install: NewAppInstall): Promise<{
  entity: AppInstall | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('app_install')
        .values({
            ...app_install,
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

export async function update(id: number, app_install: AppInstallUpdate): Promise<{
  entity: AppInstall | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('app_install')
        .set({
            ...app_install,
        })
        .where('app_install.id', '=', id)
        .where('app_install.deleted_by', 'is', null)
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
  entity: AppInstall | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('app_install')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('app_install.id', '=', id)
        .where('app_install.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<AppInstall>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('app_install')
        .where('app_install.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<AppInstall[]> {
    return db
        .selectFrom("app_install")
        .selectAll()
        .select((eb) => withUser(eb))
        .where('app_install.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<AppInstall>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("app_install").where('app_install.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('app_install.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<AppInstall>): Promise<AppInstall[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("app_install").where('app_install.deleted_by', 'is', null);
  return query
      .selectAll("app_install")
      .select((eb) => withUser(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<AppInstall | undefined> {
    return db
        .selectFrom("app_install")
        .selectAll()
        .where('app_install.id', '=', id)
        .where('app_install.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<AppInstall | undefined> {
    return db
        .selectFrom("app_install")
        .selectAll()
        .select((eb) => withUser(eb))
        .where('app_install.id', '=', id)
        .where('app_install.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function getAppsToNotify(user_ids: number[]): Promise<AppInstall[] | undefined> {
    return await db
        .selectFrom("app_install")
        .innerJoin('app_install_permissions', 'app_install_permissions.app_install_id', 'app_install.id')
        .innerJoin('permission', 'permission.id', 'app_install_permissions.permission_id')
        .selectAll('app_install')
        .selectAll()
        .select((eb) => withUser(eb))
        .where('app_install.user_id', 'in', user_ids)
        .where('app_install.push_token', 'is not', null)
        .where('app_install.active', 'is', true)
        .where('permission.name', '=', PermissionName.NOTIFICATIONS)
        .where('app_install_permissions.permission_status', 'is', true)
        .where('app_install.deleted_by', 'is', null)
        .execute();
}

export async function findByCriteria(criteria: Partial<AppInstall>): Promise<AppInstall[]> {
  return buildSelectQuery(criteria)
    .selectAll("app_install")
    .select((eb) => withUser(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<AppInstall>): Promise<AppInstall[]> {
  return buildSelectQuery(criteria)
    .selectAll("app_install")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<AppInstall>): Promise<AppInstall | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("app_install")
    .select((eb) => withUser(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<AppInstall>): Promise<AppInstall | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("app_install")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<AppInstall>) {
  let query = db.selectFrom('app_install');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<AppInstall>) {
  let query = db.updateTable('app_install');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<AppInstall>): any {
  query = query.where('app_install.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.app_version !== undefined) {
    query = query.where(
      'app_install.app_version', 
      criteria.app_version === null ? 'is' : 'like', 
      criteria.app_version === null ? null : `%${ criteria.app_version }%`
    );
  }
  if (criteria.platform !== undefined) {
    query = query.where(
      'app_install.platform', 
      criteria.platform === null ? 'is' : 'like', 
      criteria.platform === null ? null : `%${ criteria.platform }%`
    );
  }
  if (criteria.app_platform_id !== undefined) {
    query = query.where(
      'app_install.app_platform_id', 
      criteria.app_platform_id === null ? 'is' : 'like', 
      criteria.app_platform_id === null ? null : `%${ criteria.app_platform_id }%`
    );
  }
  if (criteria.os_version !== undefined) {
    query = query.where(
      'app_install.os_version', 
      criteria.os_version === null ? 'is' : 'like', 
      criteria.os_version === null ? null : `%${ criteria.os_version }%`
    );
  }
  if (criteria.push_token !== undefined) {
    query = query.where(
      'app_install.push_token', 
      criteria.push_token === null ? 'is' : 'like', 
      criteria.push_token === null ? null : `%${ criteria.push_token }%`
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'app_install.description', 
      criteria.description === null ? 'is' : 'like', 
      criteria.description === null ? null : `%${ criteria.description }%`
    );
  }
  if (criteria.active) {
    query = query.where('app_install.active', '=', criteria.active);
  }

  if (criteria.user_id) {
    query = query.where('app_install.user_id', '=', criteria.user_id);
  }

  if (criteria.created_by) {
    query = query.where('app_install.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'app_install.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
