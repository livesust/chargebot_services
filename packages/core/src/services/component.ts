export * as Component from "./component";
import db from '../database';
import { Component, ComponentUpdate, NewComponent } from "../database/component";


export async function create(component: NewComponent): Promise<Component | undefined> {
    return await db
        .insertInto('component')
        .values({
            ...component,
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, component: ComponentUpdate): Promise<Component | undefined> {
    return await db
        .updateTable('component')
        .set(component)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('component')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('component')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Component[]> {
    return await db
        .selectFrom("component")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<Component | undefined> {
    return await db
        .selectFrom("component")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Component>): Promise<Component[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Component>): Promise<Component | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<Component>) {
  let query = db.selectFrom('component').where('deleted_by', 'is', null);

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
  if (criteria.version !== undefined) {
    query = query.where(
      'version', 
      criteria.version === null ? 'is' : '=', 
      criteria.version
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'description', 
      criteria.description === null ? 'is' : '=', 
      criteria.description
    );
  }
  if (criteria.specs !== undefined) {
    query = query.where(
      'specs', 
      criteria.specs === null ? 'is' : '=', 
      criteria.specs
    );
  }
  if (criteria.location !== undefined) {
    query = query.where(
      'location', 
      criteria.location === null ? 'is' : '=', 
      criteria.location
    );
  }
  if (criteria.notes !== undefined) {
    query = query.where(
      'notes', 
      criteria.notes === null ? 'is' : '=', 
      criteria.notes
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
