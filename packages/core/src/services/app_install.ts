export * as AppInstall from "./app_install";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { AppInstall, AppInstallUpdate, NewAppInstall } from "../database/app_install";

function withUser(eb: ExpressionBuilder<Database, 'app_install'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'app_install.user_id')
    ).as('user')
}

export async function create(app_install: NewAppInstall): Promise<AppInstall | undefined> {
    return await db
        .insertInto('app_install')
        .values(app_install)
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, app_install: AppInstallUpdate): Promise<AppInstall | undefined> {
    return await db
        .updateTable('app_install')
        .set(app_install)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('app_install')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<{ id: number | undefined } | undefined> {
    return await db
        .deleteFrom('app_install')
        .where('id', '=', id)
        .returning(['id'])
        .executeTakeFirst();
}

export async function list(): Promise<AppInstall[]> {
    return await db
        .selectFrom("app_install")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<AppInstall | undefined> {
    return await db
        .selectFrom("app_install")
        .selectAll()
        .select((eb) => withUser(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<AppInstall>) {
  let query = db.selectFrom('app_install').where('deleted_by', 'is', null)

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.app_version !== undefined) {
    query = query.where(
      'app_version', 
      criteria.app_version === null ? 'is' : '=', 
      criteria.app_version
    );
  }
  if (criteria.platform !== undefined) {
    query = query.where(
      'platform', 
      criteria.platform === null ? 'is' : '=', 
      criteria.platform
    );
  }
  if (criteria.os_version !== undefined) {
    query = query.where(
      'os_version', 
      criteria.os_version === null ? 'is' : '=', 
      criteria.os_version
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

  return await query.selectAll().execute();
}
