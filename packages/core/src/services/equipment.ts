export * as Equipment from "./equipment";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { Equipment, EquipmentUpdate, NewEquipment } from "../database/equipment";

function withEquipmentType(eb: ExpressionBuilder<Database, 'equipment'>) {
    return jsonObjectFrom(
      eb.selectFrom('equipment_type')
        .selectAll()
        .whereRef('equipment_type.id', '=', 'equipment.equipment_type_id')
    ).as('equipment_type')
}

function withCustomer(eb: ExpressionBuilder<Database, 'equipment'>) {
    return jsonObjectFrom(
      eb.selectFrom('customer')
        .selectAll()
        .whereRef('customer.id', '=', 'equipment.customer_id')
    ).as('customer')
}


export async function create(equipment: NewEquipment): Promise<Equipment | undefined> {
    return await db
        .insertInto('equipment')
        .values({
            ...equipment,
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, equipment: EquipmentUpdate): Promise<Equipment | undefined> {
    return await db
        .updateTable('equipment')
        .set(equipment)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('equipment')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('equipment')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Equipment[]> {
    return await db
        .selectFrom("equipment")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<Equipment | undefined> {
    return await db
        .selectFrom("equipment")
        .selectAll()
        .select((eb) => withEquipmentType(eb))
        // uncoment to enable eager loading
        //.select((eb) => withCustomer(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Equipment>): Promise<Equipment[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withEquipmentType(eb))
    // uncoment to enable eager loading
    //.select((eb) => withCustomer(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Equipment>): Promise<Equipment | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withEquipmentType(eb))
    // uncoment to enable eager loading
    //.select((eb) => withCustomer(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<Equipment>) {
  let query = db.selectFrom('equipment').where('deleted_by', 'is', null);

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
  if (criteria.brand !== undefined) {
    query = query.where(
      'brand', 
      criteria.brand === null ? 'is' : '=', 
      criteria.brand
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'description', 
      criteria.description === null ? 'is' : '=', 
      criteria.description
    );
  }
  if (criteria.voltage) {
    query = query.where('voltage', '=', criteria.voltage);
  }
  if (criteria.max_charging_amps) {
    query = query.where('max_charging_amps', '=', criteria.max_charging_amps);
  }

  if (criteria.equipment_type_id) {
    query = query.where('equipment_type_id', '=', criteria.equipment_type_id);
  }
  if (criteria.customer_id) {
    query = query.where('customer_id', '=', criteria.customer_id);
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
