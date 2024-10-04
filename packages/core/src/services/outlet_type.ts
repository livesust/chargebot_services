export * as OutletType from "./outlet_type";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db from '../database';
import { UpdateResult } from "kysely";
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
        .set({
            ...outlet_type,
        })
        .where('outlet_type.id', '=', id)
        .where('outlet_type.deleted_by', 'is', null)
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
        .where('outlet_type.id', '=', id)
        .where('outlet_type.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<OutletType>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('outlet_type')
        .where('outlet_type.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<OutletType[]> {
    return db
        .selectFrom("outlet_type")
        .selectAll()
        .where('outlet_type.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<OutletType>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("outlet_type").where('outlet_type.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('outlet_type.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<OutletType>): Promise<OutletType[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("outlet_type").where('outlet_type.deleted_by', 'is', null);
  return query
      .selectAll("outlet_type")
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<OutletType | undefined> {
    return db
        .selectFrom("outlet_type")
        .selectAll()
        .where('outlet_type.id', '=', id)
        .where('outlet_type.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<OutletType | undefined> {
    return db
        .selectFrom("outlet_type")
        .selectAll()
        .where('outlet_type.id', '=', id)
        .where('outlet_type.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<OutletType>): Promise<OutletType[]> {
  return buildSelectQuery(criteria)
    .selectAll("outlet_type")
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<OutletType>): Promise<OutletType[]> {
  return buildSelectQuery(criteria)
    .selectAll("outlet_type")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<OutletType>): Promise<OutletType | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("outlet_type")
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<OutletType>): Promise<OutletType | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("outlet_type")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<OutletType>) {
  let query = db.selectFrom('outlet_type');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<OutletType>) {
  let query = db.updateTable('outlet_type');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<OutletType>): any {
  query = query.where('outlet_type.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.type !== undefined) {
    query = query.where(
      'outlet_type.type', 
      criteria.type === null ? 'is' : 'like', 
      criteria.type === null ? null : `%${ criteria.type }%`
    );
  }
  if (criteria.outlet_amps) {
    query = query.where('outlet_type.outlet_amps', '=', criteria.outlet_amps);
  }
  if (criteria.outlet_volts) {
    query = query.where('outlet_type.outlet_volts', '=', criteria.outlet_volts);
  }
  if (criteria.connector !== undefined) {
    query = query.where(
      'outlet_type.connector', 
      criteria.connector === null ? 'is' : 'like', 
      criteria.connector === null ? null : `%${ criteria.connector }%`
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'outlet_type.description', 
      criteria.description === null ? 'is' : 'like', 
      criteria.description === null ? null : `%${ criteria.description }%`
    );
  }


  if (criteria.created_by) {
    query = query.where('outlet_type.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'outlet_type.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
