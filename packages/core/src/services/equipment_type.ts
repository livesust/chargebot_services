export * as EquipmentType from "./equipment_type";
import db from '../database';
import { UpdateResult } from "kysely";
import { EquipmentType, EquipmentTypeUpdate, NewEquipmentType } from "../database/equipment_type";


export async function create(equipment_type: NewEquipmentType): Promise<{
  entity: EquipmentType | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('equipment_type')
        .values({
            ...equipment_type,
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

export async function update(id: number, equipment_type: EquipmentTypeUpdate): Promise<{
  entity: EquipmentType | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('equipment_type')
        .set({
            ...equipment_type,
        })
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
  entity: EquipmentType | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('equipment_type')
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

export async function removeByCriteria(criteria: Partial<EquipmentType>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('equipment_type')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<EquipmentType[]> {
    return db
        .selectFrom("equipment_type")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function count(): Promise<number> {
  const count: { value: number; } | undefined = await db
        .selectFrom("equipment_type")
        .select(({ fn }) => [
          fn.count<number>('id').as('value'),
        ])
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number): Promise<EquipmentType[]> {
    return db
        .selectFrom("equipment_type")
        .selectAll()
        .where('deleted_by', 'is', null)
        .limit(pageSize)
        .offset(page * pageSize)
        .execute();
}

export async function lazyGet(id: number): Promise<EquipmentType | undefined> {
    return db
        .selectFrom("equipment_type")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<EquipmentType | undefined> {
    return db
        .selectFrom("equipment_type")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<EquipmentType>): Promise<EquipmentType[]> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<EquipmentType>): Promise<EquipmentType[]> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<EquipmentType>): Promise<EquipmentType | undefined> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<EquipmentType>): Promise<EquipmentType | undefined> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<EquipmentType>) {
  let query = db.selectFrom('equipment_type');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<EquipmentType>) {
  let query = db.updateTable('equipment_type');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<EquipmentType>): any {
  query = query.where('deleted_by', 'is', null);

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

  return query;
}
