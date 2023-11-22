export * as AlertType from "./alert_type";
import db from '../database';
import { AlertType, AlertTypeUpdate, NewAlertType } from "../database/alert_type";


export async function create(alert_type: NewAlertType): Promise<AlertType | undefined> {
    return await db
        .insertInto('alert_type')
        .values(alert_type)
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, alert_type: AlertTypeUpdate): Promise<AlertType | undefined> {
    return await db
        .updateTable('alert_type')
        .set(alert_type)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('alert_type')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<{ id: number | undefined } | undefined> {
    return await db
        .deleteFrom('alert_type')
        .where('id', '=', id)
        .returning(['id'])
        .executeTakeFirst();
}

export async function list(): Promise<AlertType[]> {
    return await db
        .selectFrom("alert_type")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<AlertType | undefined> {
    return await db
        .selectFrom("alert_type")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<AlertType>) {
  let query = db.selectFrom('alert_type').where('deleted_by', 'is', null)

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
  if (criteria.priority) {
    query = query.where('priority', '=', criteria.priority);
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
