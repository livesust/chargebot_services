export * as BotAlert from "./bot_alert";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotAlert, BotAlertUpdate, NewBotAlert } from "../database/bot_alert";

function withAlertType(eb: ExpressionBuilder<Database, 'bot_alert'>) {
    return jsonObjectFrom(
      eb.selectFrom('alert_type')
        .selectAll()
        .whereRef('alert_type.id', '=', 'bot_alert.alert_type_id')
    ).as('alert_type')
}

function withBot(eb: ExpressionBuilder<Database, 'bot_alert'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_alert.bot_id')
    ).as('bot')
}


export async function create(bot_alert: NewBotAlert): Promise<BotAlert | undefined> {
    return await db
        .insertInto('bot_alert')
        .values({
            ...bot_alert,
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, bot_alert: BotAlertUpdate): Promise<BotAlert | undefined> {
    return await db
        .updateTable('bot_alert')
        .set(bot_alert)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('bot_alert')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('bot_alert')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotAlert[]> {
    return await db
        .selectFrom("bot_alert")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<BotAlert | undefined> {
    return await db
        .selectFrom("bot_alert")
        .selectAll()
        .select((eb) => withAlertType(eb))
        // uncoment to enable eager loading
        //.select((eb) => withBot(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotAlert>): Promise<BotAlert[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withAlertType(eb))
    // uncoment to enable eager loading
    //.select((eb) => withBot(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotAlert>): Promise<BotAlert | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withAlertType(eb))
    // uncoment to enable eager loading
    //.select((eb) => withBot(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<BotAlert>) {
  let query = db.selectFrom('bot_alert').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.message_displayed !== undefined) {
    query = query.where(
      'message_displayed', 
      criteria.message_displayed === null ? 'is' : '=', 
      criteria.message_displayed
    );
  }
  if (criteria.push_sent) {
    query = query.where('push_sent', '=', criteria.push_sent);
  }
  if (criteria.send_time) {
    query = query.where('send_time', '=', criteria.send_time);
  }
  if (criteria.display_time) {
    query = query.where('display_time', '=', criteria.display_time);
  }
  if (criteria.show) {
    query = query.where('show', '=', criteria.show);
  }
  if (criteria.dismissed) {
    query = query.where('dismissed', '=', criteria.dismissed);
  }
  if (criteria.active) {
    query = query.where('active', '=', criteria.active);
  }
  if (criteria.alert_count) {
    query = query.where('alert_count', '=', criteria.alert_count);
  }

  if (criteria.alert_type_id) {
    query = query.where('alert_type_id', '=', criteria.alert_type_id);
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
