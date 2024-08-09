export * as AppSettingsType from "./app_settings_type";
import db from '../database';
import { AppSettingsType, AppSettingsTypeUpdate, NewAppSettingsType } from "../database/app_settings_type";


export async function create(app_settings_type: NewAppSettingsType): Promise<{
  entity: AppSettingsType | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('app_settings_type')
        .select(['id'])
        .where((eb) => eb.or([
            eb('setting_name', '=', app_settings_type.setting_name),
        ]))
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    const created = await db
        .insertInto('app_settings_type')
        .values({
            ...app_settings_type,
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

export async function update(id: number, app_settings_type: AppSettingsTypeUpdate): Promise<{
  entity: AppSettingsType | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('app_settings_type')
        .set({
            ...app_settings_type,
        })
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
  entity: AppSettingsType | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('app_settings_type')
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
    db
        .deleteFrom('app_settings_type')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<AppSettingsType[]> {
    return db
        .selectFrom("app_settings_type")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function paginate(page: number, pageSize: number): Promise<AppSettingsType[]> {
    return db
        .selectFrom("app_settings_type")
        .selectAll()
        .where('deleted_by', 'is', null)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .execute();
}

export async function lazyGet(id: number): Promise<AppSettingsType | undefined> {
    return db
        .selectFrom("app_settings_type")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<AppSettingsType | undefined> {
    return db
        .selectFrom("app_settings_type")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<AppSettingsType>): Promise<AppSettingsType[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<AppSettingsType>): Promise<AppSettingsType[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<AppSettingsType>): Promise<AppSettingsType | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<AppSettingsType>): Promise<AppSettingsType | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<AppSettingsType>) {
  let query = db.selectFrom('app_settings_type').where('deleted_by', 'is', null);

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

  return query;
}
