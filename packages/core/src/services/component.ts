export * as Component from "./component";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db from '../database';
import { UpdateResult } from "kysely";
import { Component, ComponentUpdate, NewComponent } from "../database/component";


export async function create(component: NewComponent): Promise<{
  entity: Component | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('component')
        .values({
            ...component,
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

export async function update(id: number, component: ComponentUpdate): Promise<{
  entity: Component | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('component')
        .set({
            ...component,
        })
        .where('component.id', '=', id)
        .where('component.deleted_by', 'is', null)
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
  entity: Component | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('component')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('component.id', '=', id)
        .where('component.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<Component>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('component')
        .where('component.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Component[]> {
    return db
        .selectFrom("component")
        .selectAll()
        .where('component.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<Component>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("component").where('component.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('component.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<Component>): Promise<Component[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("component").where('component.deleted_by', 'is', null);
  return query
      .selectAll("component")
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<Component | undefined> {
    return db
        .selectFrom("component")
        .selectAll()
        .where('component.id', '=', id)
        .where('component.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<Component | undefined> {
    return db
        .selectFrom("component")
        .selectAll()
        .where('component.id', '=', id)
        .where('component.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Component>): Promise<Component[]> {
  return buildSelectQuery(criteria)
    .selectAll("component")
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<Component>): Promise<Component[]> {
  return buildSelectQuery(criteria)
    .selectAll("component")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Component>): Promise<Component | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("component")
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<Component>): Promise<Component | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("component")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<Component>) {
  let query = db.selectFrom('component');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<Component>) {
  let query = db.updateTable('component');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<Component>): any {
  query = query.where('component.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.name !== undefined) {
    query = query.where(
      'component.name', 
      criteria.name === null ? 'is' : 'like', 
      criteria.name === null ? null : `%${ criteria.name }%`
    );
  }
  if (criteria.version !== undefined) {
    query = query.where(
      'component.version', 
      criteria.version === null ? 'is' : 'like', 
      criteria.version === null ? null : `%${ criteria.version }%`
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'component.description', 
      criteria.description === null ? 'is' : 'like', 
      criteria.description === null ? null : `%${ criteria.description }%`
    );
  }
  if (criteria.specs !== undefined) {
    query = query.where(
      'component.specs', 
      criteria.specs === null ? 'is' : 'like', 
      criteria.specs === null ? null : `%${ criteria.specs }%`
    );
  }
  if (criteria.location !== undefined) {
    query = query.where(
      'component.location', 
      criteria.location === null ? 'is' : 'like', 
      criteria.location === null ? null : `%${ criteria.location }%`
    );
  }
  if (criteria.notes !== undefined) {
    query = query.where(
      'component.notes', 
      criteria.notes === null ? 'is' : 'like', 
      criteria.notes === null ? null : `%${ criteria.notes }%`
    );
  }


  if (criteria.created_by) {
    query = query.where('component.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'component.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
