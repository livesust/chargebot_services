export * as UniversalAppSettings from "./universal_app_settings";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { UniversalAppSettings, UniversalAppSettingsUpdate, NewUniversalAppSettings } from "../database/universal_app_settings";

export function withAppSettingsType(eb: ExpressionBuilder<Database, 'universal_app_settings'>) {
    return jsonObjectFrom(
      eb.selectFrom('app_settings_type')
        .selectAll()
        .whereRef('app_settings_type.id', '=', 'universal_app_settings.app_settings_type_id')
        .where('app_settings_type.deleted_by', 'is', null)
    ).as('app_settings_type')
}


export async function create(universal_app_settings: NewUniversalAppSettings): Promise<{
  entity: UniversalAppSettings | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('universal_app_settings')
        .select(['universal_app_settings.id'])
        .where((eb) => eb.or([
            eb('universal_app_settings.setting_value', '=', universal_app_settings.setting_value),
        ]))
        .where('universal_app_settings.deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    const created = await db
        .insertInto('universal_app_settings')
        .values({
            ...universal_app_settings,
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

export async function update(id: number, universal_app_settings: UniversalAppSettingsUpdate): Promise<{
  entity: UniversalAppSettings | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('universal_app_settings')
        .set({
            ...universal_app_settings,
        })
        .where('universal_app_settings.id', '=', id)
        .where('universal_app_settings.deleted_by', 'is', null)
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
  entity: UniversalAppSettings | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('universal_app_settings')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('universal_app_settings.id', '=', id)
        .where('universal_app_settings.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<UniversalAppSettings>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('universal_app_settings')
        .where('universal_app_settings.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<UniversalAppSettings[]> {
    return db
        .selectFrom("universal_app_settings")
        .selectAll()
        .select((eb) => withAppSettingsType(eb))
        .where('universal_app_settings.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<UniversalAppSettings>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("universal_app_settings").where('universal_app_settings.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('universal_app_settings.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<UniversalAppSettings>): Promise<UniversalAppSettings[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("universal_app_settings").where('universal_app_settings.deleted_by', 'is', null);
  return query
      .selectAll("universal_app_settings")
      .select((eb) => withAppSettingsType(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<UniversalAppSettings | undefined> {
    return db
        .selectFrom("universal_app_settings")
        .selectAll()
        .where('universal_app_settings.id', '=', id)
        .where('universal_app_settings.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<UniversalAppSettings | undefined> {
    return db
        .selectFrom("universal_app_settings")
        .selectAll()
        .select((eb) => withAppSettingsType(eb))
        .where('universal_app_settings.id', '=', id)
        .where('universal_app_settings.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<UniversalAppSettings>): Promise<UniversalAppSettings[]> {
  return buildSelectQuery(criteria)
    .selectAll("universal_app_settings")
    .select((eb) => withAppSettingsType(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<UniversalAppSettings>): Promise<UniversalAppSettings[]> {
  return buildSelectQuery(criteria)
    .selectAll("universal_app_settings")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<UniversalAppSettings>): Promise<UniversalAppSettings | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("universal_app_settings")
    .select((eb) => withAppSettingsType(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<UniversalAppSettings>): Promise<UniversalAppSettings | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("universal_app_settings")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<UniversalAppSettings>) {
  let query = db.selectFrom('universal_app_settings');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<UniversalAppSettings>) {
  let query = db.updateTable('universal_app_settings');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<UniversalAppSettings>): any {
  query = query.where('universal_app_settings.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.setting_value !== undefined) {
    query = query.where(
      'universal_app_settings.setting_value', 
      criteria.setting_value === null ? 'is' : 'like', 
      criteria.setting_value === null ? null : `%${ criteria.setting_value }%`
    );
  }

  if (criteria.app_settings_type_id) {
    query = query.where('universal_app_settings.app_settings_type_id', '=', criteria.app_settings_type_id);
  }

  if (criteria.created_by) {
    query = query.where('universal_app_settings.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'universal_app_settings.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
