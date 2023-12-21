export * as OutletSchedule from "./outlet_schedule";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { OutletSchedule, OutletScheduleUpdate, NewOutletSchedule } from "../database/outlet_schedule";

function withOutlet(eb: ExpressionBuilder<Database, 'outlet_schedule'>) {
    return jsonObjectFrom(
      eb.selectFrom('outlet')
        .selectAll()
        .whereRef('outlet.id', '=', 'outlet_schedule.outlet_id')
    ).as('outlet')
}


export async function create(outlet_schedule: NewOutletSchedule): Promise<OutletSchedule | undefined> {
    return await db
        .insertInto('outlet_schedule')
        .values({
            ...outlet_schedule,
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, outlet_schedule: OutletScheduleUpdate): Promise<OutletSchedule | undefined> {
    return await db
        .updateTable('outlet_schedule')
        .set(outlet_schedule)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('outlet_schedule')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('outlet_schedule')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<OutletSchedule[]> {
    return await db
        .selectFrom("outlet_schedule")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<OutletSchedule | undefined> {
    return await db
        .selectFrom("outlet_schedule")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withOutlet(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<OutletSchedule>): Promise<OutletSchedule[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    // uncoment to enable eager loading
    //.select((eb) => withOutlet(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<OutletSchedule>): Promise<OutletSchedule | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    // uncoment to enable eager loading
    //.select((eb) => withOutlet(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<OutletSchedule>) {
  let query = db.selectFrom('outlet_schedule').where('deleted_by', 'is', null);

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

  if (criteria.outlet_id) {
    query = query.where('outlet_id', '=', criteria.outlet_id);
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
