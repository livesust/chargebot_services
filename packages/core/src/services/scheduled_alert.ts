export * as ScheduledAlert from "./scheduled_alert";
import db from '../database';
import { ScheduledAlert, ScheduledAlertUpdate, NewScheduledAlert } from "../database/scheduled_alert";


export async function create(scheduled_alert: NewScheduledAlert): Promise<ScheduledAlert | undefined> {
    const exists = await db
        .selectFrom('scheduled_alert')
        .select(['id'])
        .where((eb) => eb.or([
            eb('name', '=', scheduled_alert.name),
        ]))
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    return await db
        .insertInto('scheduled_alert')
        .values({
            ...scheduled_alert,
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, scheduled_alert: ScheduledAlertUpdate): Promise<ScheduledAlert | undefined> {
    return await db
        .updateTable('scheduled_alert')
        .set(scheduled_alert)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('scheduled_alert')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('scheduled_alert')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<ScheduledAlert[]> {
    return await db
        .selectFrom("scheduled_alert")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<ScheduledAlert | undefined> {
    return await db
        .selectFrom("scheduled_alert")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<ScheduledAlert>) {
  let query = db.selectFrom('scheduled_alert').where('deleted_by', 'is', null)

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.name !== undefined) {
    query = query.where(
      'name', 
      criteria.name === null ? 'is' : '=', 
      criteria.name
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'description', 
      criteria.description === null ? 'is' : '=', 
      criteria.description
    );
  }
  if (criteria.alert_content !== undefined) {
    query = query.where(
      'alert_content', 
      criteria.alert_content === null ? 'is' : '=', 
      criteria.alert_content
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
