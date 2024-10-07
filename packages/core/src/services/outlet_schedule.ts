export * as OutletSchedule from "./outlet_schedule";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { DateTime } from 'luxon';
import { OutletSchedule, OutletScheduleUpdate, NewOutletSchedule } from "../database/outlet_schedule";
import { Outlet } from "./outlet";

export function withOutlet(eb: ExpressionBuilder<Database, 'outlet_schedule'>) {
    return jsonObjectFrom(
      eb.selectFrom('outlet')
        .selectAll()
        .whereRef('outlet.id', '=', 'outlet_schedule.outlet_id')
        .where('outlet.deleted_by', 'is', null)
    ).as('outlet')
}


export async function create(outlet_schedule: NewOutletSchedule): Promise<{
  entity: OutletSchedule | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('outlet_schedule')
        .values({
            ...outlet_schedule,
        })
        .returningAll()
        .executeTakeFirst();
    
    if (!created) {
      return undefined;
    }

    return await buildResponse(created);
}

export async function update(id: number, outlet_schedule: OutletScheduleUpdate): Promise<{
  entity: OutletSchedule | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('outlet_schedule')
        .set({
            ...outlet_schedule,
        })
        .where('outlet_schedule.id', '=', id)
        .where('outlet_schedule.deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();

    if (!updated) {
      return undefined;
    }

    return await buildResponse(updated);
}

export async function remove(id: number, user_id: string): Promise<{
  entity: OutletSchedule | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('outlet_schedule')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('outlet_schedule.id', '=', id)
        .where('outlet_schedule.deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();

  if (!deleted) {
    return undefined;
  }

  const outlet = await Outlet.get(deleted.outlet_id);

  return {
    entity: deleted,
    // event to dispatch on EventBus on creation
    // undefined as default to not dispatch any event
    event: outlet?.bot?.bot_uuid ? {
      topic: `chargebot/control/${outlet?.bot?.bot_uuid}/outlet`,
      payload: {
        // firmware expect outlet id from 0
        outlet_id: outlet.pdu_outlet_number - 1,
        command: "set_schedule",
        params: {
          all_day: true,
          start_time: "00:00",
          end_time: "23:59",
        }
      }
    } : undefined
  };
}

export async function removeByCriteria(criteria: Partial<OutletSchedule>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('outlet_schedule')
        .where('outlet_schedule.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<OutletSchedule[]> {
    return db
        .selectFrom("outlet_schedule")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withOutlet(eb))
        .where('outlet_schedule.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<OutletSchedule>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("outlet_schedule").where('outlet_schedule.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('outlet_schedule.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<OutletSchedule>): Promise<OutletSchedule[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("outlet_schedule").where('outlet_schedule.deleted_by', 'is', null);
  return query
      .selectAll("outlet_schedule")
      // uncoment to enable eager loading
      //.select((eb) => withOutlet(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<OutletSchedule | undefined> {
    return db
        .selectFrom("outlet_schedule")
        .selectAll()
        .where('outlet_schedule.id', '=', id)
        .where('outlet_schedule.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<OutletSchedule | undefined> {
    return db
        .selectFrom("outlet_schedule")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withOutlet(eb))
        .where('outlet_schedule.id', '=', id)
        .where('outlet_schedule.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<OutletSchedule>): Promise<OutletSchedule[]> {
  return buildSelectQuery(criteria)
    .selectAll("outlet_schedule")
    // uncoment to enable eager loading
    //.select((eb) => withOutlet(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<OutletSchedule>): Promise<OutletSchedule[]> {
  return buildSelectQuery(criteria)
    .selectAll("outlet_schedule")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<OutletSchedule>): Promise<OutletSchedule | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("outlet_schedule")
    // uncoment to enable eager loading
    //.select((eb) => withOutlet(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<OutletSchedule>): Promise<OutletSchedule | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("outlet_schedule")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<OutletSchedule>) {
  let query = db.selectFrom('outlet_schedule');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<OutletSchedule>) {
  let query = db.updateTable('outlet_schedule');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<OutletSchedule>): any {
  query = query.where('outlet_schedule.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.day_of_week !== undefined) {
    query = query.where(
      'outlet_schedule.day_of_week', 
      criteria.day_of_week === null ? 'is' : 'like', 
      criteria.day_of_week === null ? null : `%${ criteria.day_of_week }%`
    );
  }
  if (criteria.all_day) {
    query = query.where('outlet_schedule.all_day', '=', criteria.all_day);
  }
  if (criteria.start_time) {
    query = query.where('outlet_schedule.start_time', '=', criteria.start_time);
  }
  if (criteria.end_time) {
    query = query.where('outlet_schedule.end_time', '=', criteria.end_time);
  }

  if (criteria.outlet_id) {
    query = query.where('outlet_schedule.outlet_id', '=', criteria.outlet_id);
  }

  if (criteria.created_by) {
    query = query.where('outlet_schedule.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'outlet_schedule.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}

async function buildResponse(schedule: OutletSchedule) {
  const outlet = await Outlet.get(schedule.outlet_id);
  const allDay = schedule.all_day ?? true;
  const startTime = !allDay && schedule.start_time ? DateTime.fromJSDate(new Date(schedule.start_time)).toLocaleString(DateTime.TIME_24_SIMPLE) : "00:00";
  const endTime = !allDay && schedule.end_time ? DateTime.fromJSDate(new Date(schedule.end_time)).toLocaleString(DateTime.TIME_24_SIMPLE) : "23:59";

  return {
    entity: schedule,
    // event to dispatch on EventBus on creation
    // undefined as default to not dispatch any event
    event: outlet?.bot?.bot_uuid ? {
      topic: `chargebot/control/${outlet?.bot?.bot_uuid}/outlet`,
      payload: {
        // firmware expect outlet id from 0
        outlet_id: outlet.pdu_outlet_number - 1,
        command: "set_schedule",
        params: {
          all_day: allDay,
          start_time: startTime,
          end_time: endTime,
        }
      }
    } : undefined
  };
}
