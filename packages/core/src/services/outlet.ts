export * as Outlet from "./outlet";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { Outlet, OutletUpdate, NewOutlet } from "../database/outlet";

export function withOutletType(eb: ExpressionBuilder<Database, 'outlet'>) {
    return jsonObjectFrom(
      eb.selectFrom('outlet_type')
        .selectAll()
        .whereRef('outlet_type.id', '=', 'outlet.outlet_type_id')
        .where('outlet_type.deleted_by', 'is', null)
    ).as('outlet_type')
}

export function withBot(eb: ExpressionBuilder<Database, 'outlet'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'outlet.bot_id')
        .where('bot.deleted_by', 'is', null)
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
        .set({
            ...outlet,
        })
        .where('outlet.id', '=', id)
        .where('outlet.deleted_by', 'is', null)
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
        .where('outlet.id', '=', id)
        .where('outlet.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<Outlet>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('outlet')
        .where('outlet.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Outlet[]> {
    return db
        .selectFrom("outlet")
        .selectAll()
        .select((eb) => withOutletType(eb))
        .select((eb) => withBot(eb))
        .where('outlet.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<Outlet>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("outlet").where('outlet.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('outlet.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<Outlet>): Promise<Outlet[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("outlet").where('outlet.deleted_by', 'is', null);
  return query
      .selectAll("outlet")
      .select((eb) => withOutletType(eb))
      .select((eb) => withBot(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<Outlet | undefined> {
    return db
        .selectFrom("outlet")
        .selectAll()
        .where('outlet.id', '=', id)
        .where('outlet.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<Outlet | undefined> {
    return db
        .selectFrom("outlet")
        .selectAll()
        .select((eb) => withOutletType(eb))
        .select((eb) => withBot(eb))
        .where('outlet.id', '=', id)
        .where('outlet.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByBot(bot_uuid: string): Promise<Outlet[]> {
  return await db
    .selectFrom('outlet')
    .innerJoin('bot', 'bot.id', 'outlet.bot_id')
    .where('bot.bot_uuid', '=', bot_uuid)
    .where('outlet.deleted_by', 'is', null)
    .selectAll('outlet')
    .orderBy('pdu_outlet_number', 'asc')
    .execute();
}

export async function findByBotAndPduOutletNumber(bot_uuid: string, pdu_outlet_number: number): Promise<Outlet | undefined> {
  return await db
    .selectFrom('outlet')
    .innerJoin('bot', 'bot.id', 'outlet.bot_id')
    .where('bot.bot_uuid', '=', bot_uuid)
    .where('outlet.pdu_outlet_number', '=', pdu_outlet_number)
    .where('outlet.deleted_by', 'is', null)
    .selectAll('outlet')
    .executeTakeFirst();
}

export async function findByEquipment(equipment_id: number): Promise<Outlet | undefined> {
  return db
    .selectFrom('outlet')
    .innerJoin('outlet_equipment', 'outlet_equipment.outlet_id', 'outlet.id')
    .where('outlet_equipment.equipment_id', '=', equipment_id)
    .where('outlet.deleted_by', 'is', null)
    .where('outlet_equipment.deleted_by', 'is', null)
    .selectAll('outlet')
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Outlet>): Promise<Outlet[]> {
  return buildSelectQuery(criteria)
    .selectAll('outlet')
    .select((eb) => withOutletType(eb))
    .select((eb) => withBot(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<Outlet>): Promise<Outlet[]> {
  return buildSelectQuery(criteria)
    .selectAll('outlet')
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Outlet>): Promise<Outlet | undefined> {
  return buildSelectQuery(criteria)
    .selectAll('outlet')
    .select((eb) => withOutletType(eb))
    .select((eb) => withBot(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<Outlet>): Promise<Outlet | undefined> {
  return buildSelectQuery(criteria)
    .selectAll('outlet')
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<Outlet>) {
  let query = db.selectFrom('outlet');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<Outlet>) {
  let query = db.updateTable('outlet');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<Outlet>): any {
  query = query.where('outlet.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.pdu_outlet_number) {
    query = query.where('outlet.pdu_outlet_number', '=', criteria.pdu_outlet_number);
  }
  if (criteria.priority_charge_state !== undefined) {
    query = query.where(
      'outlet.priority_charge_state', 
      criteria.priority_charge_state === null ? 'is' : 'like', 
      criteria.priority_charge_state === null ? null : `%${ criteria.priority_charge_state }%`
    );
  }
  if (criteria.notes !== undefined) {
    query = query.where(
      'outlet.notes', 
      criteria.notes === null ? 'is' : 'like', 
      criteria.notes === null ? null : `%${ criteria.notes }%`
    );
  }

  if (criteria.outlet_type_id) {
    query = query.where('outlet.outlet_type_id', '=', criteria.outlet_type_id);
  }
  if (criteria.bot_id) {
    query = query.where('outlet.bot_id', '=', criteria.bot_id);
  }

  if (criteria.created_by) {
    query = query.where('outlet.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'outlet.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
