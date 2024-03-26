export * as OutletType from "./outlet_type";
import db from '../database';
import { OutletType, OutletTypeUpdate, NewOutletType } from "../database/outlet_type";


export async function create(outlet_type: NewOutletType): Promise<{
  entity: OutletType | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('outlet_type')
        .values({
            ...outlet_type,
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

export async function update(id: number, outlet_type: OutletTypeUpdate): Promise<{
  entity: OutletType | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('outlet_type')
        .set(outlet_type)
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
  entity: OutletType | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('outlet_type')
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
        .deleteFrom('outlet_type')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<OutletType[]> {
    return db
        .selectFrom("outlet_type")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<OutletType | undefined> {
    return db
        .selectFrom("outlet_type")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<OutletType>): Promise<OutletType[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<OutletType>): Promise<OutletType | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<OutletType>) {
  let query = db.selectFrom('outlet_type').where('deleted_by', 'is', null);

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
  if (criteria.outlet_amps) {
    query = query.where('outlet_amps', '=', criteria.outlet_amps);
  }
  if (criteria.outlet_volts) {
    query = query.where('outlet_volts', '=', criteria.outlet_volts);
  }
  if (criteria.connector !== undefined) {
    query = query.where(
      'connector', 
      criteria.connector === null ? 'is' : '=', 
      criteria.connector
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
