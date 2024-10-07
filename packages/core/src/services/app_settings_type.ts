export * as AppSettingsType from "./app_settings_type";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db from '../database';
import { UpdateResult } from "kysely";
import { AppSettingsType, AppSettingsTypeUpdate, NewAppSettingsType } from "../database/app_settings_type";


export async function create(app_settings_type: NewAppSettingsType): Promise<{
  entity: AppSettingsType | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('app_settings_type')
        .select(['app_settings_type.id'])
        .where((eb) => eb.or([
            eb('app_settings_type.setting_name', '=', app_settings_type.setting_name),
        ]))
        .where('app_settings_type.deleted_by', 'is', null)
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
        .where('app_settings_type.id', '=', id)
        .where('app_settings_type.deleted_by', 'is', null)
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
        .where('app_settings_type.id', '=', id)
        .where('app_settings_type.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<AppSettingsType>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('app_settings_type')
        .where('app_settings_type.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<AppSettingsType[]> {
    return db
        .selectFrom("app_settings_type")
        .selectAll()
        .where('app_settings_type.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<AppSettingsType>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("app_settings_type").where('app_settings_type.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('app_settings_type.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<AppSettingsType>): Promise<AppSettingsType[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("app_settings_type").where('app_settings_type.deleted_by', 'is', null);
  return query
      .selectAll("app_settings_type")
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<AppSettingsType | undefined> {
    return db
        .selectFrom("app_settings_type")
        .selectAll()
        .where('app_settings_type.id', '=', id)
        .where('app_settings_type.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<AppSettingsType | undefined> {
    return db
        .selectFrom("app_settings_type")
        .selectAll()
        .where('app_settings_type.id', '=', id)
        .where('app_settings_type.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<AppSettingsType>): Promise<AppSettingsType[]> {
  return buildSelectQuery(criteria)
    .selectAll("app_settings_type")
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<AppSettingsType>): Promise<AppSettingsType[]> {
  return buildSelectQuery(criteria)
    .selectAll("app_settings_type")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<AppSettingsType>): Promise<AppSettingsType | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("app_settings_type")
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<AppSettingsType>): Promise<AppSettingsType | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("app_settings_type")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<AppSettingsType>) {
  let query = db.selectFrom('app_settings_type');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<AppSettingsType>) {
  let query = db.updateTable('app_settings_type');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<AppSettingsType>): any {
  query = query.where('app_settings_type.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.setting_name !== undefined) {
    query = query.where(
      'app_settings_type.setting_name', 
      criteria.setting_name === null ? 'is' : 'like', 
      criteria.setting_name === null ? null : `%${ criteria.setting_name }%`
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'app_settings_type.description', 
      criteria.description === null ? 'is' : 'like', 
      criteria.description === null ? null : `%${ criteria.description }%`
    );
  }


  if (criteria.created_by) {
    query = query.where('app_settings_type.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'app_settings_type.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
