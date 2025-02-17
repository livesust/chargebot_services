export * as OutletEquipment from "./outlet_equipment";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { OutletEquipment, OutletEquipmentUpdate, NewOutletEquipment } from "../database/outlet_equipment";
import { withEquipmentType } from "./equipment";
import { withBot } from "./outlet";

export function withEquipment(eb: ExpressionBuilder<Database, 'outlet_equipment'>) {
    return jsonObjectFrom(
      eb.selectFrom('equipment')
        .selectAll()
        .select((eb) => withEquipmentType(eb))
        .whereRef('equipment.id', '=', 'outlet_equipment.equipment_id')
        .where('equipment.deleted_by', 'is', null)
    ).as('equipment')
}

export function withOutlet(eb: ExpressionBuilder<Database, 'outlet_equipment'>) {
    return jsonObjectFrom(
      eb.selectFrom('outlet')
        .selectAll()
        .select((eb) => withBot(eb))
        .whereRef('outlet.id', '=', 'outlet_equipment.outlet_id')
        .where('outlet.deleted_by', 'is', null)
    ).as('outlet')
}

export function withUser(eb: ExpressionBuilder<Database, 'outlet_equipment'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'outlet_equipment.user_id')
        .where('user.deleted_by', 'is', null)
    ).as('user')
}


export async function create(outlet_equipment: NewOutletEquipment): Promise<{
  entity: OutletEquipment | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('outlet_equipment')
        .values({
            ...outlet_equipment,
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

export async function update(id: number, outlet_equipment: OutletEquipmentUpdate): Promise<{
  entity: OutletEquipment | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('outlet_equipment')
        .set({
            ...outlet_equipment,
        })
        .where('outlet_equipment.id', '=', id)
        .where('outlet_equipment.deleted_by', 'is', null)
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
  entity: OutletEquipment | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('outlet_equipment')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('outlet_equipment.id', '=', id)
        .where('outlet_equipment.deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();

  if (!deleted) {
    return undefined;
  }

  return {
    entity: deleted,
    // event to dispatch on EventBus on creation
    // undefined as default to not dispatch any event
    event: undefined
  };
}

export async function unassignByOutlet(outlet_id: number, user_id: string): Promise<OutletEquipment | undefined> {
    return db
        .updateTable('outlet_equipment')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('outlet_id', '=', outlet_id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function unassignByEquipment(equipment_id: number, user_id: string): Promise<OutletEquipment | undefined> {
    return db
        .updateTable('outlet_equipment')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('equipment_id', '=', equipment_id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function unassign(equipment_id: number, outlet_id: number, user_id: string): Promise<{
  entity: OutletEquipment | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('outlet_equipment')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('equipment_id', '=', equipment_id)
        .where('outlet_id', '=', outlet_id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();

  if (!deleted) {
    return undefined;
  }

  return {
    entity: deleted,
    // event to dispatch on EventBus on creation
    // undefined as default to not dispatch any event
    event: undefined
  };
}

export async function removeByCriteria(criteria: Partial<OutletEquipment>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('outlet_equipment')
        .where('outlet_equipment.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<OutletEquipment[]> {
    return db
        .selectFrom("outlet_equipment")
        .selectAll()
        .select((eb) => withEquipment(eb))
        .select((eb) => withOutlet(eb))
        .select((eb) => withUser(eb))
        .where('outlet_equipment.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<OutletEquipment>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("outlet_equipment").where('outlet_equipment.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('outlet_equipment.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<OutletEquipment>): Promise<OutletEquipment[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("outlet_equipment").where('outlet_equipment.deleted_by', 'is', null);
  return query
      .selectAll("outlet_equipment")
      .select((eb) => withEquipment(eb))
      .select((eb) => withOutlet(eb))
      .select((eb) => withUser(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<OutletEquipment | undefined> {
    return db
        .selectFrom("outlet_equipment")
        .selectAll()
        .where('outlet_equipment.id', '=', id)
        .where('outlet_equipment.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<OutletEquipment | undefined> {
    return db
        .selectFrom("outlet_equipment")
        .selectAll()
        .select((eb) => withEquipment(eb))
        .select((eb) => withOutlet(eb))
        .select((eb) => withUser(eb))
        .where('outlet_equipment.id', '=', id)
        .where('outlet_equipment.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByOutlets(outlet_ids: number[]): Promise<OutletEquipment[]> {
  return db
        .selectFrom("outlet_equipment")
        .selectAll()
        .select((eb) => withEquipment(eb))
        .where('outlet_equipment.outlet_id', 'in', outlet_ids)
        .where('outlet_equipment.deleted_by', 'is', null)
        .execute();
}

export async function findByCriteria(criteria: Partial<OutletEquipment>): Promise<OutletEquipment[]> {
  return buildSelectQuery(criteria)
    .selectAll("outlet_equipment")
    .select((eb) => withEquipment(eb))
    .select((eb) => withOutlet(eb))
    .select((eb) => withUser(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<OutletEquipment>): Promise<OutletEquipment[]> {
  return buildSelectQuery(criteria)
    .selectAll("outlet_equipment")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<OutletEquipment>): Promise<OutletEquipment | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("outlet_equipment")
    .select((eb) => withEquipment(eb))
    .select((eb) => withOutlet(eb))
    .select((eb) => withUser(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<OutletEquipment>): Promise<OutletEquipment | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("outlet_equipment")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<OutletEquipment>) {
  let query = db.selectFrom('outlet_equipment');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<OutletEquipment>) {
  let query = db.updateTable('outlet_equipment');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<OutletEquipment>): any {
  query = query.where('outlet_equipment.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.notes !== undefined) {
    query = query.where(
      'outlet_equipment.notes', 
      criteria.notes === null ? 'is' : 'like', 
      criteria.notes === null ? null : `%${ criteria.notes }%`
    );
  }

  if (criteria.equipment_id) {
    query = query.where('outlet_equipment.equipment_id', '=', criteria.equipment_id);
  }
  if (criteria.outlet_id) {
    query = query.where('outlet_equipment.outlet_id', '=', criteria.outlet_id);
  }
  if (criteria.user_id) {
    query = query.where('outlet_equipment.user_id', '=', criteria.user_id);
  }

  if (criteria.created_by) {
    query = query.where('outlet_equipment.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'outlet_equipment.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
