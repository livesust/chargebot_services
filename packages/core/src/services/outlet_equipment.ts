export * as OutletEquipment from "./outlet_equipment";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { OutletEquipment, OutletEquipmentUpdate, NewOutletEquipment } from "../database/outlet_equipment";

function withEquipment(eb: ExpressionBuilder<Database, 'outlet_equipment'>) {
    return jsonObjectFrom(
      eb.selectFrom('equipment')
        .selectAll()
        .whereRef('equipment.id', '=', 'outlet_equipment.equipment_id')
    ).as('equipment')
}
function withOutlet(eb: ExpressionBuilder<Database, 'outlet_equipment'>) {
    return jsonObjectFrom(
      eb.selectFrom('outlet')
        .selectAll()
        .whereRef('outlet.id', '=', 'outlet_equipment.outlet_id')
    ).as('outlet')
}
function withUser(eb: ExpressionBuilder<Database, 'outlet_equipment'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'outlet_equipment.user_id')
    ).as('user')
}

export async function create(outlet_equipment: NewOutletEquipment): Promise<OutletEquipment | undefined> {
    return await db
        .insertInto('outlet_equipment')
        .values(outlet_equipment)
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, outlet_equipment: OutletEquipmentUpdate): Promise<OutletEquipment | undefined> {
    return await db
        .updateTable('outlet_equipment')
        .set(outlet_equipment)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('outlet_equipment')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<{ id: number | undefined } | undefined> {
    return await db
        .deleteFrom('outlet_equipment')
        .where('id', '=', id)
        .returning(['id'])
        .executeTakeFirst();
}

export async function list(): Promise<OutletEquipment[]> {
    return await db
        .selectFrom("outlet_equipment")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<OutletEquipment | undefined> {
    return await db
        .selectFrom("outlet_equipment")
        .selectAll()
        .select((eb) => withEquipment(eb))
        // uncoment to enable eager loading
        //.select((eb) => withOutlet(eb))
        // uncoment to enable eager loading
        //.select((eb) => withUser(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<OutletEquipment>) {
  let query = db.selectFrom('outlet_equipment').where('deleted_by', 'is', null)

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

  return await query.selectAll().execute();
}
