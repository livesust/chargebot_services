export * as Vehicle from "./vehicle";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { Vehicle, VehicleUpdate, NewVehicle } from "../database/vehicle";

export function withVehicleType(eb: ExpressionBuilder<Database, 'vehicle'>) {
    return jsonObjectFrom(
      eb.selectFrom('vehicle_type')
        .selectAll()
        .whereRef('vehicle_type.id', '=', 'vehicle.vehicle_type_id')
        .where('vehicle_type.deleted_by', 'is', null)
    ).as('vehicle_type')
}


export async function create(vehicle: NewVehicle): Promise<{
  entity: Vehicle | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('vehicle')
        .select(['vehicle.id'])
        .where((eb) => eb.or([
            eb('vehicle.license_plate', '=', vehicle.license_plate),
        ]))
        .where('vehicle.deleted_by', 'is', null)
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
        .set({
            ...vehicle,
        })
        .where('vehicle.id', '=', id)
        .where('vehicle.deleted_by', 'is', null)
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
        .where('vehicle.id', '=', id)
        .where('vehicle.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<Vehicle>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('vehicle')
        .where('vehicle.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Vehicle[]> {
    return db
        .selectFrom("vehicle")
        .selectAll()
        .select((eb) => withVehicleType(eb))
        .where('vehicle.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<Vehicle>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("vehicle").where('vehicle.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('vehicle.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<Vehicle>): Promise<Vehicle[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("vehicle").where('vehicle.deleted_by', 'is', null);
  return query
      .selectAll("vehicle")
      .select((eb) => withVehicleType(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<Vehicle | undefined> {
    return db
        .selectFrom("vehicle")
        .selectAll()
        .where('vehicle.id', '=', id)
        .where('vehicle.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<Vehicle | undefined> {
    return db
        .selectFrom("vehicle")
        .selectAll()
        .select((eb) => withVehicleType(eb))
        .where('vehicle.id', '=', id)
        .where('vehicle.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Vehicle>): Promise<Vehicle[]> {
  return buildSelectQuery(criteria)
    .selectAll("vehicle")
    .select((eb) => withVehicleType(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<Vehicle>): Promise<Vehicle[]> {
  return buildSelectQuery(criteria)
    .selectAll("vehicle")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Vehicle>): Promise<Vehicle | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("vehicle")
    .select((eb) => withVehicleType(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<Vehicle>): Promise<Vehicle | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("vehicle")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<Vehicle>) {
  let query = db.selectFrom('vehicle');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<Vehicle>) {
  let query = db.updateTable('vehicle');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<Vehicle>): any {
  query = query.where('vehicle.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.name !== undefined) {
    query = query.where(
      'vehicle.name', 
      criteria.name === null ? 'is' : 'like', 
      criteria.name === null ? null : `%${ criteria.name }%`
    );
  }
  if (criteria.license_plate !== undefined) {
    query = query.where(
      'vehicle.license_plate', 
      criteria.license_plate === null ? 'is' : 'like', 
      criteria.license_plate === null ? null : `%${ criteria.license_plate }%`
    );
  }
  if (criteria.notes !== undefined) {
    query = query.where(
      'vehicle.notes', 
      criteria.notes === null ? 'is' : 'like', 
      criteria.notes === null ? null : `%${ criteria.notes }%`
    );
  }

  if (criteria.vehicle_type_id) {
    query = query.where('vehicle.vehicle_type_id', '=', criteria.vehicle_type_id);
  }

  if (criteria.created_by) {
    query = query.where('vehicle.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'vehicle.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
