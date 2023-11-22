export * as AppSettingsType from "./app_settings_type";
import db from '../database';
import { AppSettingsType, AppSettingsTypeUpdate, NewAppSettingsType } from "../database/app_settings_type";


export async function create(app_settings_type: NewAppSettingsType): Promise<AppSettingsType | undefined> {
    return await db
        .insertInto('app_settings_type')
        .values(app_settings_type)
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, app_settings_type: AppSettingsTypeUpdate): Promise<AppSettingsType | undefined> {
    return await db
        .updateTable('app_settings_type')
        .set(app_settings_type)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('app_settings_type')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<{ id: number | undefined } | undefined> {
    return await db
        .deleteFrom('app_settings_type')
        .where('id', '=', id)
        .returning(['id'])
        .executeTakeFirst();
}

export async function list(): Promise<AppSettingsType[]> {
    return await db
        .selectFrom("app_settings_type")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<AppSettingsType | undefined> {
    return await db
        .selectFrom("app_settings_type")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<AppSettingsType>) {
  let query = db.selectFrom('app_settings_type').where('deleted_by', 'is', null)

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.setting_name !== undefined) {
    query = query.where(
      'setting_name', 
      criteria.setting_name === null ? 'is' : '=', 
      criteria.setting_name
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
