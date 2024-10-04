export * as EquipmentType from "./equipment_type";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
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
        .where('equipment_type.id', '=', id)
        .where('equipment_type.deleted_by', 'is', null)
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
        .where('equipment_type.id', '=', id)
        .where('equipment_type.deleted_by', 'is', null)
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
        .where('equipment_type.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<EquipmentType[]> {
    return db
        .selectFrom("equipment_type")
        .selectAll()
        .where('equipment_type.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<EquipmentType>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("equipment_type").where('equipment_type.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('equipment_type.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<EquipmentType>): Promise<EquipmentType[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("equipment_type").where('equipment_type.deleted_by', 'is', null);
  return query
      .selectAll("equipment_type")
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<EquipmentType | undefined> {
    return db
        .selectFrom("equipment_type")
        .selectAll()
        .where('equipment_type.id', '=', id)
        .where('equipment_type.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<EquipmentType | undefined> {
    return db
        .selectFrom("equipment_type")
        .selectAll()
        .where('equipment_type.id', '=', id)
        .where('equipment_type.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<EquipmentType>): Promise<EquipmentType[]> {
  return buildSelectQuery(criteria)
    .selectAll("equipment_type")
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<EquipmentType>): Promise<EquipmentType[]> {
  return buildSelectQuery(criteria)
    .selectAll("equipment_type")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<EquipmentType>): Promise<EquipmentType | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("equipment_type")
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<EquipmentType>): Promise<EquipmentType | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("equipment_type")
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
  query = query.where('equipment_type.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.type !== undefined) {
    query = query.where(
      'equipment_type.type', 
      criteria.type === null ? 'is' : 'like', 
      criteria.type === null ? null : `%${ criteria.type }%`
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'equipment_type.description', 
      criteria.description === null ? 'is' : 'like', 
      criteria.description === null ? null : `%${ criteria.description }%`
    );
  }


  if (criteria.created_by) {
    query = query.where('equipment_type.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'equipment_type.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
