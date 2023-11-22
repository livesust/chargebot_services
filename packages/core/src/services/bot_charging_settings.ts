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

export async function create(bot_charging_settings: NewBotChargingSettings): Promise<BotChargingSettings | undefined> {
    return await db
        .insertInto('bot_charging_settings')
        .values(bot_charging_settings)
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, bot_charging_settings: BotChargingSettingsUpdate): Promise<BotChargingSettings | undefined> {
    return await db
        .updateTable('bot_charging_settings')
        .set(bot_charging_settings)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('bot_charging_settings')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<{ id: number | undefined } | undefined> {
    return await db
        .deleteFrom('bot_charging_settings')
        .where('id', '=', id)
        .returning(['id'])
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

export async function findByCriteria(criteria: Partial<BotChargingSettings>) {
  let query = db.selectFrom('bot_charging_settings').where('deleted_by', 'is', null)

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.day_of_week) {
    query = query.where('day_of_week', '=', criteria.day_of_week);
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
