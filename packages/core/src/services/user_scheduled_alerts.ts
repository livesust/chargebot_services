export * as UserScheduledAlerts from "./user_scheduled_alerts";
import db, { Database, json } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { UserScheduledAlerts, UserScheduledAlertsUpdate, NewUserScheduledAlerts } from "../database/user_scheduled_alerts";

function withScheduledAlert(eb: ExpressionBuilder<Database, 'user_scheduled_alerts'>) {
    return jsonObjectFrom(
      eb.selectFrom('scheduled_alert')
        .selectAll()
        .whereRef('scheduled_alert.id', '=', 'user_scheduled_alerts.scheduled_alert_id')
    ).as('scheduled_alert')
}

function withUser(eb: ExpressionBuilder<Database, 'user_scheduled_alerts'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'user_scheduled_alerts.user_id')
    ).as('user')
}


export async function create(user_scheduled_alerts: NewUserScheduledAlerts): Promise<UserScheduledAlerts | undefined> {
    // check if many-to-many record already exists
    const existent = await db
          .selectFrom("user_scheduled_alerts")
          .selectAll()
          .where('scheduled_alert_id', '=', user_scheduled_alerts.scheduled_alert_id)
          .where('user_id', '=', user_scheduled_alerts.user_id)
          .where('deleted_by', 'is', null)
          .executeTakeFirst();
    if (existent) {
        // return existent many-to-many record, do not create a new one
        return existent;
    }
    return await db
        .insertInto('user_scheduled_alerts')
        .values({
            ...user_scheduled_alerts,
            settings: json(user_scheduled_alerts.settings),
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, user_scheduled_alerts: UserScheduledAlertsUpdate): Promise<UserScheduledAlerts | undefined> {
    return await db
        .updateTable('user_scheduled_alerts')
        .set(user_scheduled_alerts)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('user_scheduled_alerts')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('user_scheduled_alerts')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<UserScheduledAlerts[]> {
    return await db
        .selectFrom("user_scheduled_alerts")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<UserScheduledAlerts | undefined> {
    return await db
        .selectFrom("user_scheduled_alerts")
        .selectAll()
        .select((eb) => withScheduledAlert(eb))
        .select((eb) => withUser(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<UserScheduledAlerts>): Promise<UserScheduledAlerts[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withScheduledAlert(eb))
    .select((eb) => withUser(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<UserScheduledAlerts>): Promise<UserScheduledAlerts | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withScheduledAlert(eb))
    .select((eb) => withUser(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<UserScheduledAlerts>) {
  let query = db.selectFrom('user_scheduled_alerts').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.alert_status) {
    query = query.where('alert_status', '=', criteria.alert_status);
  }
  if (criteria.settings) {
    query = query.where('settings', '=', criteria.settings);
  }

  if (criteria.scheduled_alert_id) {
    query = query.where('scheduled_alert_id', '=', criteria.scheduled_alert_id);
  }

  if (criteria.user_id) {
    query = query.where('user_id', '=', criteria.user_id);
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
