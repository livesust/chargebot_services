export * as AlertType from "./alert_type";
import db from '../database';
import { AlertType, AlertTypeUpdate, NewAlertType } from "../database/alert_type";


export async function create(alert_type: NewAlertType): Promise<AlertType | undefined> {
//    const exists = await db
//        .selectFrom('alert_type')
//        .select(['id'])
//        .where((eb) => eb.or([
//            eb('name', '=', alert_type.name),
//        ]))
//        .where('deleted_by', 'is', null)
//        .executeTakeFirst();
//    if (exists) {
//        throw Error('Entity already exists with unique values');
//    }
    return await db
        .insertInto('alert_type')
        .values({
            ...alert_type,
        })
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

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('alert_type')
        .where('id', '=', id)
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
  if (criteria.priority !== undefined) {
    query = query.where(
      'priority', 
      criteria.priority === null ? 'is' : '=', 
      criteria.priority
    );
  }
  if (criteria.severity !== undefined) {
    query = query.where(
      'severity', 
      criteria.severity === null ? 'is' : '=', 
      criteria.severity
    );
  }
  if (criteria.color_code !== undefined) {
    query = query.where(
      'color_code', 
      criteria.color_code === null ? 'is' : '=', 
      criteria.color_code
    );
  }
  if (criteria.send_push) {
    query = query.where('send_push', '=', criteria.send_push);
  }
  if (criteria.alert_text !== undefined) {
    query = query.where(
      'alert_text', 
      criteria.alert_text === null ? 'is' : '=', 
      criteria.alert_text
    );
  }
  if (criteria.alert_link !== undefined) {
    query = query.where(
      'alert_link', 
      criteria.alert_link === null ? 'is' : '=', 
      criteria.alert_link
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
