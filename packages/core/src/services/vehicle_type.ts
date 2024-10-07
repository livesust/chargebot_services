export * as VehicleType from "./vehicle_type";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db from '../database';
import { UpdateResult } from "kysely";
import { VehicleType, VehicleTypeUpdate, NewVehicleType } from "../database/vehicle_type";


export async function create(vehicle_type: NewVehicleType): Promise<{
  entity: VehicleType | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('vehicle_type')
        .values({
            ...vehicle_type,
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

export async function update(id: number, vehicle_type: VehicleTypeUpdate): Promise<{
  entity: VehicleType | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('vehicle_type')
        .set({
            ...vehicle_type,
        })
        .where('vehicle_type.id', '=', id)
        .where('vehicle_type.deleted_by', 'is', null)
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
  entity: VehicleType | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('vehicle_type')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('vehicle_type.id', '=', id)
        .where('vehicle_type.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<VehicleType>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('vehicle_type')
        .where('vehicle_type.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<VehicleType[]> {
    return db
        .selectFrom("vehicle_type")
        .selectAll()
        .where('vehicle_type.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<VehicleType>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("vehicle_type").where('vehicle_type.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('vehicle_type.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<VehicleType>): Promise<VehicleType[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("vehicle_type").where('vehicle_type.deleted_by', 'is', null);
  return query
      .selectAll("vehicle_type")
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<VehicleType | undefined> {
    return db
        .selectFrom("vehicle_type")
        .selectAll()
        .where('vehicle_type.id', '=', id)
        .where('vehicle_type.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<VehicleType | undefined> {
    return db
        .selectFrom("vehicle_type")
        .selectAll()
        .where('vehicle_type.id', '=', id)
        .where('vehicle_type.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<VehicleType>): Promise<VehicleType[]> {
  return buildSelectQuery(criteria)
    .selectAll("vehicle_type")
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<VehicleType>): Promise<VehicleType[]> {
  return buildSelectQuery(criteria)
    .selectAll("vehicle_type")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<VehicleType>): Promise<VehicleType | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("vehicle_type")
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<VehicleType>): Promise<VehicleType | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("vehicle_type")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<VehicleType>) {
  let query = db.selectFrom('vehicle_type');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<VehicleType>) {
  let query = db.updateTable('vehicle_type');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<VehicleType>): any {
  query = query.where('vehicle_type.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.type !== undefined) {
    query = query.where(
      'vehicle_type.type', 
      criteria.type === null ? 'is' : 'like', 
      criteria.type === null ? null : `%${ criteria.type }%`
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'vehicle_type.description', 
      criteria.description === null ? 'is' : 'like', 
      criteria.description === null ? null : `%${ criteria.description }%`
    );
  }


  if (criteria.created_by) {
    query = query.where('vehicle_type.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'vehicle_type.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
