export * as Vehicle from "./vehicle";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { Vehicle, VehicleUpdate, NewVehicle } from "../database/vehicle";

export function withVehicleType(eb: ExpressionBuilder<Database, 'vehicle'>) {
    return jsonObjectFrom(
      eb.selectFrom('vehicle_type')
        .selectAll()
        .whereRef('vehicle_type.id', '=', 'vehicle.vehicle_type_id')
    ).as('vehicle_type')
}


export async function create(vehicle: NewVehicle): Promise<{
  entity: Vehicle | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('vehicle')
        .select(['id'])
        .where((eb) => eb.or([
            eb('license_plate', '=', vehicle.license_plate),
        ]))
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    const created = await db
        .insertInto('vehicle')
        .values({
            ...vehicle,
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

export async function update(id: number, vehicle: VehicleUpdate): Promise<{
  entity: Vehicle | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('vehicle')
        .set(vehicle)
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
  entity: Vehicle | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('vehicle')
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
        .deleteFrom('vehicle')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Vehicle[]> {
    return db
        .selectFrom("vehicle")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<Vehicle | undefined> {
    return db
        .selectFrom("vehicle")
        .selectAll()
        .select((eb) => withVehicleType(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Vehicle>): Promise<Vehicle[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withVehicleType(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Vehicle>): Promise<Vehicle | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withVehicleType(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<Vehicle>) {
  let query = db.selectFrom('vehicle').where('deleted_by', 'is', null);

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
  if (criteria.license_plate !== undefined) {
    query = query.where(
      'license_plate', 
      criteria.license_plate === null ? 'is' : '=', 
      criteria.license_plate
    );
  }
  if (criteria.notes !== undefined) {
    query = query.where(
      'notes', 
      criteria.notes === null ? 'is' : '=', 
      criteria.notes
    );
  }

  if (criteria.vehicle_type_id) {
    query = query.where('vehicle_type_id', '=', criteria.vehicle_type_id);
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
