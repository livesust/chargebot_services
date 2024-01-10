export * as BotChargingSettings from "./bot_charging_settings";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotChargingSettings, BotChargingSettingsUpdate, NewBotChargingSettings } from "../database/bot_charging_settings";

function withBot(eb: ExpressionBuilder<Database, 'bot_charging_settings'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_charging_settings.bot_id')
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
        .set(bot_charging_settings)
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
  entity: BotChargingSettings | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_charging_settings')
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
        .deleteFrom('bot_charging_settings')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotChargingSettings[]> {
    return await db
        .selectFrom("bot_charging_settings")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<BotChargingSettings | undefined> {
    return await db
        .selectFrom("bot_charging_settings")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withBot(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotChargingSettings>): Promise<BotChargingSettings[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    // uncoment to enable eager loading
    //.select((eb) => withBot(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotChargingSettings>): Promise<BotChargingSettings | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    // uncoment to enable eager loading
    //.select((eb) => withBot(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<BotChargingSettings>) {
  let query = db.selectFrom('bot_charging_settings').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.day_of_week !== undefined) {
    query = query.where(
      'day_of_week', 
      criteria.day_of_week === null ? 'is' : '=', 
      criteria.day_of_week
    );
  }
  if (criteria.all_day) {
    query = query.where('all_day', '=', criteria.all_day);
  }
  if (criteria.start_time) {
    query = query.where('start_time', '=', criteria.start_time);
  }
  if (criteria.end_time) {
    query = query.where('end_time', '=', criteria.end_time);
  }

  if (criteria.bot_id) {
    query = query.where('bot_id', '=', criteria.bot_id);
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
