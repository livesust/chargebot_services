export * as EquipmentType from "./equipment_type";
import db from '../database';
import { EquipmentType, EquipmentTypeUpdate, NewEquipmentType } from "../database/equipment_type";


export async function create(equipment_type: NewEquipmentType): Promise<EquipmentType | undefined> {
    return await db
        .insertInto('equipment_type')
        .values({
            ...equipment_type,
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, equipment_type: EquipmentTypeUpdate): Promise<EquipmentType | undefined> {
    return await db
        .updateTable('equipment_type')
        .set(equipment_type)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('equipment_type')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('equipment_type')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<EquipmentType[]> {
    return await db
        .selectFrom("equipment_type")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<EquipmentType | undefined> {
    return await db
        .selectFrom("equipment_type")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<EquipmentType>): Promise<EquipmentType[]> {
  let query = db.selectFrom('equipment_type').where('deleted_by', 'is', null)

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.type !== undefined) {
    query = query.where(
      'type', 
      criteria.type === null ? 'is' : '=', 
      criteria.type
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'description', 
      criteria.description === null ? 'is' : '=', 
      criteria.description
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

  return await query
    .selectAll()
    .execute();
}
