export * as Equipment from "./equipment";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { Equipment, EquipmentUpdate, NewEquipment } from "../database/equipment";

export function withEquipmentType(eb: ExpressionBuilder<Database, 'equipment'>) {
    return jsonObjectFrom(
      eb.selectFrom('equipment_type')
        .selectAll()
        .whereRef('equipment_type.id', '=', 'equipment.equipment_type_id')
        .where('equipment_type.deleted_by', 'is', null)
    ).as('equipment_type')
}

export function withCustomer(eb: ExpressionBuilder<Database, 'equipment'>) {
    return jsonObjectFrom(
      eb.selectFrom('customer')
        .selectAll()
        .whereRef('customer.id', '=', 'equipment.customer_id')
        .where('customer.deleted_by', 'is', null)
    ).as('customer')
}


export async function create(equipment: NewEquipment): Promise<{
  entity: Equipment | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('equipment')
        .values({
            ...equipment,
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

export async function update(id: number, equipment: EquipmentUpdate): Promise<{
  entity: Equipment | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('equipment')
        .set({
            ...equipment,
        })
        .where('equipment.id', '=', id)
        .where('equipment.deleted_by', 'is', null)
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
  entity: Equipment | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('equipment')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('equipment.id', '=', id)
        .where('equipment.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<Equipment>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('equipment')
        .where('equipment.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Equipment[]> {
    return db
        .selectFrom("equipment")
        .selectAll()
        .select((eb) => withEquipmentType(eb))
        .select((eb) => withCustomer(eb))
        .where('equipment.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<Equipment>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("equipment").where('equipment.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('equipment.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<Equipment>): Promise<Equipment[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("equipment").where('equipment.deleted_by', 'is', null);
  return query
      .selectAll("equipment")
      .select((eb) => withEquipmentType(eb))
      .select((eb) => withCustomer(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<Equipment | undefined> {
    return db
        .selectFrom("equipment")
        .selectAll()
        .where('equipment.id', '=', id)
        .where('equipment.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<Equipment | undefined> {
    return db
        .selectFrom("equipment")
        .selectAll()
        .select((eb) => withEquipmentType(eb))
        .select((eb) => withCustomer(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByOutlet(outlet_id: number): Promise<Equipment | undefined> {
  return db
    .selectFrom('equipment')
    .innerJoin('outlet_equipment', 'outlet_equipment.equipment_id', 'equipment.id')
    .where('outlet_equipment.outlet_id', '=', outlet_id)
    .where('equipment.deleted_by', 'is', null)
    .where('outlet_equipment.deleted_by', 'is', null)
    .selectAll('equipment')
    .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Equipment>): Promise<Equipment[]> {
  return buildSelectQuery(criteria)
    .selectAll('equipment')
    .select((eb) => withEquipmentType(eb))
    .select((eb) => withCustomer(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<Equipment>): Promise<Equipment[]> {
  return buildSelectQuery(criteria)
    .selectAll('equipment')
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Equipment>): Promise<Equipment | undefined> {
  return buildSelectQuery(criteria)
    .selectAll('equipment')
    .select((eb) => withEquipmentType(eb))
    .select((eb) => withCustomer(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<Equipment>): Promise<Equipment | undefined> {
  return buildSelectQuery(criteria)
    .selectAll('equipment')
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<Equipment>) {
  let query = db.selectFrom('equipment');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<Equipment>) {
  let query = db.updateTable('equipment');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<Equipment>): any {
  query = query.where('equipment.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.name !== undefined) {
    query = query.where(
      'equipment.name', 
      criteria.name === null ? 'is' : 'like', 
      criteria.name === null ? null : `%${ criteria.name }%`
    );
  }
  if (criteria.brand !== undefined) {
    query = query.where(
      'equipment.brand', 
      criteria.brand === null ? 'is' : 'like', 
      criteria.brand === null ? null : `%${ criteria.brand }%`
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'equipment.description', 
      criteria.description === null ? 'is' : 'like', 
      criteria.description === null ? null : `%${ criteria.description }%`
    );
  }
  if (criteria.voltage) {
    query = query.where('equipment.voltage', '=', criteria.voltage);
  }
  if (criteria.max_charging_amps) {
    query = query.where('equipment.max_charging_amps', '=', criteria.max_charging_amps);
  }

  if (criteria.equipment_type_id) {
    query = query.where('equipment.equipment_type_id', '=', criteria.equipment_type_id);
  }
  if (criteria.customer_id) {
    query = query.where('equipment.customer_id', '=', criteria.customer_id);
  }

  if (criteria.created_by) {
    query = query.where('equipment.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'equipment.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
