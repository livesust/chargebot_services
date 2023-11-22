export * as BotScheduledAlerts from "./bot_scheduled_alerts";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotScheduledAlerts, BotScheduledAlertsUpdate, NewBotScheduledAlerts } from "../database/bot_scheduled_alerts";

function withScheduledAlert(eb: ExpressionBuilder<Database, 'bot_scheduled_alerts'>) {
    return jsonObjectFrom(
      eb.selectFrom('scheduled_alert')
        .selectAll()
        .whereRef('scheduled_alert.id', '=', 'bot_scheduled_alerts.scheduled_alert_id')
    ).as('scheduled_alert')
}
function withUser(eb: ExpressionBuilder<Database, 'bot_scheduled_alerts'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'bot_scheduled_alerts.user_id')
    ).as('user')
}

export async function create(bot_scheduled_alerts: NewBotScheduledAlerts): Promise<BotScheduledAlerts | undefined> {
    return await db
        .insertInto('bot_scheduled_alerts')
        .values(bot_scheduled_alerts)
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, bot_scheduled_alerts: BotScheduledAlertsUpdate): Promise<BotScheduledAlerts | undefined> {
    return await db
        .updateTable('bot_scheduled_alerts')
        .set(bot_scheduled_alerts)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('bot_scheduled_alerts')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<{ id: number | undefined } | undefined> {
    return await db
        .deleteFrom('bot_scheduled_alerts')
        .where('id', '=', id)
        .returning(['id'])
        .executeTakeFirst();
}

export async function list(): Promise<BotScheduledAlerts[]> {
    return await db
        .selectFrom("bot_scheduled_alerts")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<BotScheduledAlerts | undefined> {
    return await db
        .selectFrom("bot_scheduled_alerts")
        .selectAll()
        .select((eb) => withScheduledAlert(eb))
        // uncoment to enable eager loading
        //.select((eb) => withUser(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotScheduledAlerts>) {
  let query = db.selectFrom('bot_scheduled_alerts').where('deleted_by', 'is', null)

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.alert_status) {
    query = query.where('alert_status', '=', criteria.alert_status);
  }
  if (criteria.settings !== undefined) {
    query = query.where(
      'settings', 
      criteria.settings === null ? 'is' : '=', 
      criteria.settings
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
