export * as ComponentAttribute from "./component_attribute";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { ComponentAttribute, ComponentAttributeUpdate, NewComponentAttribute } from "../database/component_attribute";

export function withComponent(eb: ExpressionBuilder<Database, 'component_attribute'>) {
    return jsonObjectFrom(
      eb.selectFrom('component')
        .selectAll()
        .whereRef('component.id', '=', 'component_attribute.component_id')
        .where('component.deleted_by', 'is', null)
    ).as('component')
}


export async function create(component_attribute: NewComponentAttribute): Promise<{
  entity: ComponentAttribute | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('component_attribute')
        .values({
            ...component_attribute,
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

export async function update(id: number, component_attribute: ComponentAttributeUpdate): Promise<{
  entity: ComponentAttribute | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('component_attribute')
        .set({
            ...component_attribute,
        })
        .where('component_attribute.id', '=', id)
        .where('component_attribute.deleted_by', 'is', null)
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
  entity: ComponentAttribute | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('component_attribute')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('component_attribute.id', '=', id)
        .where('component_attribute.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<ComponentAttribute>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('component_attribute')
        .where('component_attribute.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<ComponentAttribute[]> {
    return db
        .selectFrom("component_attribute")
        .selectAll()
        .select((eb) => withComponent(eb))
        .where('component_attribute.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<ComponentAttribute>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("component_attribute").where('component_attribute.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('component_attribute.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<ComponentAttribute>): Promise<ComponentAttribute[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("component_attribute").where('component_attribute.deleted_by', 'is', null);
  return query
      .selectAll("component_attribute")
      .select((eb) => withComponent(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<ComponentAttribute | undefined> {
    return db
        .selectFrom("component_attribute")
        .selectAll()
        .where('component_attribute.id', '=', id)
        .where('component_attribute.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<ComponentAttribute | undefined> {
    return db
        .selectFrom("component_attribute")
        .selectAll()
        .select((eb) => withComponent(eb))
        .where('component_attribute.id', '=', id)
        .where('component_attribute.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<ComponentAttribute>): Promise<ComponentAttribute[]> {
  return buildSelectQuery(criteria)
    .selectAll("component_attribute")
    .select((eb) => withComponent(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<ComponentAttribute>): Promise<ComponentAttribute[]> {
  return buildSelectQuery(criteria)
    .selectAll("component_attribute")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<ComponentAttribute>): Promise<ComponentAttribute | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("component_attribute")
    .select((eb) => withComponent(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<ComponentAttribute>): Promise<ComponentAttribute | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("component_attribute")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<ComponentAttribute>) {
  let query = db.selectFrom('component_attribute');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<ComponentAttribute>) {
  let query = db.updateTable('component_attribute');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<ComponentAttribute>): any {
  query = query.where('component_attribute.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.name !== undefined) {
    query = query.where(
      'component_attribute.name', 
      criteria.name === null ? 'is' : 'like', 
      criteria.name === null ? null : `%${ criteria.name }%`
    );
  }
  if (criteria.type !== undefined) {
    query = query.where(
      'component_attribute.type', 
      criteria.type === null ? 'is' : 'like', 
      criteria.type === null ? null : `%${ criteria.type }%`
    );
  }

  if (criteria.component_id) {
    query = query.where('component_attribute.component_id', '=', criteria.component_id);
  }

  if (criteria.created_by) {
    query = query.where('component_attribute.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'component_attribute.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
