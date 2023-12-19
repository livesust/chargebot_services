export * as Equipment from "./equipment";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { Equipment, EquipmentUpdate, NewEquipment } from "../database/equipment";


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
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Equipment>): Promise<Equipment[]> {
  let query = db.selectFrom('equipment').where('deleted_by', 'is', null)

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

  return await query
    .selectAll()
    .execute();
}
