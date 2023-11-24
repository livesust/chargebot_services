export * as UniversalAppSettings from "./universal_app_settings";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { UniversalAppSettings, UniversalAppSettingsUpdate, NewUniversalAppSettings } from "../database/universal_app_settings";

function withAppSettingsType(eb: ExpressionBuilder<Database, 'universal_app_settings'>) {
    return jsonObjectFrom(
      eb.selectFrom('app_settings_type')
        .selectAll()
        .whereRef('app_settings_type.id', '=', 'universal_app_settings.app_settings_type_id')
    ).as('app_settings_type')
}

export async function create(universal_app_settings: NewUniversalAppSettings): Promise<UniversalAppSettings | undefined> {
//    const exists = await db
//        .selectFrom('universal_app_settings')
//        .select(['id'])
//        .where((eb) => eb.or([
//            eb('setting_value', '=', universal_app_settings.setting_value),
//        ]))
//        .where('deleted_by', 'is', null)
//        .executeTakeFirst();
//    if (exists) {
//        throw Error('Entity already exists with unique values');
//    }
    return await db
        .insertInto('universal_app_settings')
        .values({
            ...universal_app_settings,
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, universal_app_settings: UniversalAppSettingsUpdate): Promise<UniversalAppSettings | undefined> {
    return await db
        .updateTable('universal_app_settings')
        .set(universal_app_settings)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('universal_app_settings')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('universal_app_settings')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<UniversalAppSettings[]> {
    return await db
        .selectFrom("universal_app_settings")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<UniversalAppSettings | undefined> {
    return await db
        .selectFrom("universal_app_settings")
        .selectAll()
        .select((eb) => withAppSettingsType(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<UniversalAppSettings>) {
  let query = db.selectFrom('universal_app_settings').where('deleted_by', 'is', null)

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.setting_value !== undefined) {
    query = query.where(
      'setting_value', 
      criteria.setting_value === null ? 'is' : '=', 
      criteria.setting_value
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
