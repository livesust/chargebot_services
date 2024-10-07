export * as BotChargingSettings from "./bot_charging_settings";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotChargingSettings, BotChargingSettingsUpdate, NewBotChargingSettings } from "../database/bot_charging_settings";

export function withBot(eb: ExpressionBuilder<Database, 'bot_charging_settings'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_charging_settings.bot_id')
        .where('bot.deleted_by', 'is', null)
    ).as('bot')
}


export async function create(bot_charging_settings: NewBotChargingSettings): Promise<{
  entity: BotChargingSettings | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('bot_charging_settings')
        .values({
            ...bot_charging_settings,
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

export async function update(id: number, bot_charging_settings: BotChargingSettingsUpdate): Promise<{
  entity: BotChargingSettings | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot_charging_settings')
        .set({
            ...bot_charging_settings,
        })
        .where('bot_charging_settings.id', '=', id)
        .where('bot_charging_settings.deleted_by', 'is', null)
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
  entity: BotChargingSettings | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_charging_settings')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot_charging_settings.id', '=', id)
        .where('bot_charging_settings.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<BotChargingSettings>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot_charging_settings')
        .where('bot_charging_settings.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotChargingSettings[]> {
    return db
        .selectFrom("bot_charging_settings")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withBot(eb))
        .where('bot_charging_settings.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<BotChargingSettings>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_charging_settings").where('bot_charging_settings.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot_charging_settings.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<BotChargingSettings>): Promise<BotChargingSettings[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_charging_settings").where('bot_charging_settings.deleted_by', 'is', null);
  return query
      .selectAll("bot_charging_settings")
      // uncoment to enable eager loading
      //.select((eb) => withBot(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<BotChargingSettings | undefined> {
    return db
        .selectFrom("bot_charging_settings")
        .selectAll()
        .where('bot_charging_settings.id', '=', id)
        .where('bot_charging_settings.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotChargingSettings | undefined> {
    return db
        .selectFrom("bot_charging_settings")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withBot(eb))
        .where('bot_charging_settings.id', '=', id)
        .where('bot_charging_settings.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotChargingSettings>): Promise<BotChargingSettings[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_charging_settings")
    // uncoment to enable eager loading
    //.select((eb) => withBot(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotChargingSettings>): Promise<BotChargingSettings[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_charging_settings")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotChargingSettings>): Promise<BotChargingSettings | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_charging_settings")
    // uncoment to enable eager loading
    //.select((eb) => withBot(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotChargingSettings>): Promise<BotChargingSettings | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_charging_settings")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<BotChargingSettings>) {
  let query = db.selectFrom('bot_charging_settings');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<BotChargingSettings>) {
  let query = db.updateTable('bot_charging_settings');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<BotChargingSettings>): any {
  query = query.where('bot_charging_settings.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.day_of_week !== undefined) {
    query = query.where(
      'bot_charging_settings.day_of_week', 
      criteria.day_of_week === null ? 'is' : 'like', 
      criteria.day_of_week === null ? null : `%${ criteria.day_of_week }%`
    );
  }
  if (criteria.all_day) {
    query = query.where('bot_charging_settings.all_day', '=', criteria.all_day);
  }
  if (criteria.start_time) {
    query = query.where('bot_charging_settings.start_time', '=', criteria.start_time);
  }
  if (criteria.end_time) {
    query = query.where('bot_charging_settings.end_time', '=', criteria.end_time);
  }

  if (criteria.bot_id) {
    query = query.where('bot_charging_settings.bot_id', '=', criteria.bot_id);
  }

  if (criteria.created_by) {
    query = query.where('bot_charging_settings.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot_charging_settings.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
