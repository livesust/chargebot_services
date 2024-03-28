export * as Outlet from "./outlet";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { Outlet, OutletUpdate, NewOutlet } from "../database/outlet";

export function withOutletType(eb: ExpressionBuilder<Database, 'outlet'>) {
    return jsonObjectFrom(
      eb.selectFrom('outlet_type')
        .selectAll()
        .whereRef('outlet_type.id', '=', 'outlet.outlet_type_id')
    ).as('outlet_type')
}

export function withBot(eb: ExpressionBuilder<Database, 'outlet'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'outlet.bot_id')
    ).as('bot')
}


export async function create(outlet: NewOutlet): Promise<{
  entity: Outlet | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('outlet')
        .values({
            ...outlet,
        })
        .returningAll()
        .executeTakeFirst();
    
    if (!created) {
      return undefined;
    }

    return {
      entity: created,
      // event to dispatch on EventBus on creation
      // undefined as default to not dispatch any event
      event: undefined
    };
}

export async function update(id: number, outlet: OutletUpdate): Promise<{
  entity: Outlet | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('outlet')
        .set(outlet)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();

    if (!updated) {
      return undefined;
    }

    return {
      entity: updated,
      // event to dispatch on EventBus on creation
      // undefined as default to not dispatch any event
      event: undefined
    };
}

export async function remove(id: number, user_id: string): Promise<{
  entity: Outlet | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('outlet')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();

  if (!deleted) {
    return undefined;
  }

  return {
    entity: deleted,
    event: deleted
  };
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('outlet')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Outlet[]> {
    return db
        .selectFrom("outlet")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function lazyGet(id: number): Promise<Outlet | undefined> {
    return db
        .selectFrom("outlet")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<Outlet | undefined> {
    return db
        .selectFrom("outlet")
        .selectAll()
        .select((eb) => withOutletType(eb))
        .select((eb) => withBot(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByBot(bot_uuid: string): Promise<Outlet[]> {
  return await db
    .selectFrom('outlet')
    .innerJoin('bot', 'bot.id', 'outlet.bot_id')
    .where('bot.bot_uuid', '=', bot_uuid)
    .selectAll('outlet')
    .execute();
}

export async function findByBotAndPduNumber(bot_uuid: string, pdu_outlet_number: number): Promise<Outlet[]> {
  return await db
    .selectFrom('outlet')
    .innerJoin('bot', 'bot.id', 'outlet.bot_id')
    .where('bot.bot_uuid', '=', bot_uuid)
    .where('outlet.pdu_outlet_number', '=', pdu_outlet_number)
    .selectAll('outlet')
    .execute();
}

export async function findByEquipment(equipment_id: number): Promise<Outlet | undefined> {
  return db
    .selectFrom('outlet')
    .innerJoin('outlet_equipment', 'outlet_equipment.outlet_id', 'outlet.id')
    .where('outlet_equipment.equipment_id', '=', equipment_id)
    .selectAll('outlet')
    .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Outlet>): Promise<Outlet[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withOutletType(eb))
    .select((eb) => withBot(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<Outlet>): Promise<Outlet[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Outlet>): Promise<Outlet | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withOutletType(eb))
    .select((eb) => withBot(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<Outlet>): Promise<Outlet | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
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
