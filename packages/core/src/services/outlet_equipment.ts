export * as OutletEquipment from "./outlet_equipment";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { OutletEquipment, OutletEquipmentUpdate, NewOutletEquipment } from "../database/outlet_equipment";
import { withEquipmentType } from "./equipment";

export function withEquipment(eb: ExpressionBuilder<Database, 'outlet_equipment'>) {
    return jsonObjectFrom(
      eb.selectFrom('equipment')
        .selectAll()
        .select((eb) => withEquipmentType(eb))
        .whereRef('equipment.id', '=', 'outlet_equipment.equipment_id')
    ).as('equipment')
}

export function withOutlet(eb: ExpressionBuilder<Database, 'outlet_equipment'>) {
    return jsonObjectFrom(
      eb.selectFrom('outlet')
        .selectAll()
        .whereRef('outlet.id', '=', 'outlet_equipment.outlet_id')
    ).as('outlet')
}

export function withUser(eb: ExpressionBuilder<Database, 'outlet_equipment'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'outlet_equipment.user_id')
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
        .set(outlet_equipment)
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
  entity: OutletEquipment | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('outlet_equipment')
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
    // event to dispatch on EventBus on creation
    // undefined as default to not dispatch any event
    event: undefined
  };
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('outlet_equipment')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<OutletEquipment[]> {
    return db
        .selectFrom("outlet_equipment")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<OutletEquipment | undefined> {
    return db
        .selectFrom("outlet_equipment")
        .selectAll()
        .select((eb) => withEquipment(eb))
        .select((eb) => withOutlet(eb))
        .select((eb) => withUser(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByOutlets(outlet_ids: number[]): Promise<OutletEquipment[]> {
  return db
        .selectFrom("outlet_equipment")
        .selectAll()
        .select((eb) => withEquipment(eb))
        .where('outlet_id', 'in', outlet_ids)
        .where('deleted_by', 'is', null)
        .execute();
}

export async function findByCriteria(criteria: Partial<OutletEquipment>): Promise<OutletEquipment[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withEquipment(eb))
    .select((eb) => withOutlet(eb))
    .select((eb) => withUser(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<OutletEquipment>): Promise<OutletEquipment | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withEquipment(eb))
    .select((eb) => withOutlet(eb))
    .select((eb) => withUser(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<OutletEquipment>) {
  let query = db.selectFrom('outlet_equipment').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.notes !== undefined) {
    query = query.where(
      'notes', 
      criteria.notes === null ? 'is' : '=', 
      criteria.notes
    );
  }

  if (criteria.equipment_id) {
    query = query.where('equipment_id', '=', criteria.equipment_id);
  }
  if (criteria.outlet_id) {
    query = query.where('outlet_id', '=', criteria.outlet_id);
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
