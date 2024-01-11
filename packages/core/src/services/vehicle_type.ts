export * as VehicleType from "./vehicle_type";
import db from '../database';
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
        .set(vehicle_type)
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
  entity: VehicleType | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('vehicle_type')
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
    await db
        .deleteFrom('vehicle_type')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<VehicleType[]> {
    return await db
        .selectFrom("vehicle_type")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<VehicleType | undefined> {
    return await db
        .selectFrom("vehicle_type")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<VehicleType>): Promise<VehicleType[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<VehicleType>): Promise<VehicleType | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<VehicleType>) {
  let query = db.selectFrom('vehicle_type').where('deleted_by', 'is', null);

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