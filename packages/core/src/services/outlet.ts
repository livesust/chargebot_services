export * as Outlet from "./outlet";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { Outlet, OutletUpdate, NewOutlet } from "../database/outlet";

function withOutletType(eb: ExpressionBuilder<Database, 'outlet'>) {
    return jsonObjectFrom(
      eb.selectFrom('outlet_type')
        .selectAll()
        .whereRef('outlet_type.id', '=', 'outlet.outlet_type_id')
    ).as('outlet_type')
}

function withBot(eb: ExpressionBuilder<Database, 'outlet'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'outlet.bot_id')
    ).as('bot')
}


export async function create(outlet: NewOutlet): Promise<Outlet | undefined> {
    return await db
        .insertInto('outlet')
        .values({
            ...outlet,
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, outlet: OutletUpdate): Promise<Outlet | undefined> {
    return await db
        .updateTable('outlet')
        .set(outlet)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('outlet')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('outlet')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Outlet[]> {
    return await db
        .selectFrom("outlet")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<Outlet | undefined> {
    return await db
        .selectFrom("outlet")
        .selectAll()
        .select((eb) => withOutletType(eb))
        // uncoment to enable eager loading
        //.select((eb) => withBot(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Outlet>): Promise<Outlet[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withOutletType(eb))
    // uncoment to enable eager loading
    //.select((eb) => withBot(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Outlet>): Promise<Outlet | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withOutletType(eb))
    // uncoment to enable eager loading
    //.select((eb) => withBot(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<Outlet>) {
  let query = db.selectFrom('outlet').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.pdu_outlet_number) {
    query = query.where('pdu_outlet_number', '=', criteria.pdu_outlet_number);
  }
  if (criteria.notes !== undefined) {
    query = query.where(
      'notes', 
      criteria.notes === null ? 'is' : '=', 
      criteria.notes
    );
  }

  if (criteria.outlet_type_id) {
    query = query.where('outlet_type_id', '=', criteria.outlet_type_id);
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
