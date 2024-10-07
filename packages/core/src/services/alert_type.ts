export * as AlertType from "./alert_type";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db from '../database';
import { UpdateResult } from "kysely";
import { AlertType, AlertTypeUpdate, NewAlertType } from "../database/alert_type";


export async function create(alert_type: NewAlertType): Promise<{
  entity: AlertType | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('alert_type')
        .select(['alert_type.id'])
        .where((eb) => eb.or([
            eb('alert_type.name', '=', alert_type.name),
        ]))
        .where('alert_type.deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    const created = await db
        .insertInto('alert_type')
        .values({
            ...alert_type,
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

export async function update(id: number, alert_type: AlertTypeUpdate): Promise<{
  entity: AlertType | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('alert_type')
        .set({
            ...alert_type,
        })
        .where('alert_type.id', '=', id)
        .where('alert_type.deleted_by', 'is', null)
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
  entity: AlertType | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('alert_type')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('alert_type.id', '=', id)
        .where('alert_type.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<AlertType>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('alert_type')
        .where('alert_type.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<AlertType[]> {
    return db
        .selectFrom("alert_type")
        .selectAll()
        .where('alert_type.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<AlertType>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("alert_type").where('alert_type.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('alert_type.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<AlertType>): Promise<AlertType[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("alert_type").where('alert_type.deleted_by', 'is', null);
  return query
      .selectAll("alert_type")
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<AlertType | undefined> {
    return db
        .selectFrom("alert_type")
        .selectAll()
        .where('alert_type.id', '=', id)
        .where('alert_type.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<AlertType | undefined> {
    return db
        .selectFrom("alert_type")
        .selectAll()
        .where('alert_type.id', '=', id)
        .where('alert_type.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<AlertType>): Promise<AlertType[]> {
  return buildSelectQuery(criteria)
    .selectAll("alert_type")
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<AlertType>): Promise<AlertType[]> {
  return buildSelectQuery(criteria)
    .selectAll("alert_type")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<AlertType>): Promise<AlertType | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("alert_type")
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<AlertType>): Promise<AlertType | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("alert_type")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<AlertType>) {
  let query = db.selectFrom('alert_type');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<AlertType>) {
  let query = db.updateTable('alert_type');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<AlertType>): any {
  query = query.where('alert_type.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.name !== undefined) {
    query = query.where(
      'alert_type.name', 
      criteria.name === null ? 'is' : 'like', 
      criteria.name === null ? null : `%${ criteria.name }%`
    );
  }
  if (criteria.description !== undefined) {
    query = query.where(
      'alert_type.description', 
      criteria.description === null ? 'is' : 'like', 
      criteria.description === null ? null : `%${ criteria.description }%`
    );
  }
  if (criteria.priority !== undefined) {
    query = query.where(
      'alert_type.priority', 
      criteria.priority === null ? 'is' : 'like', 
      criteria.priority === null ? null : `%${ criteria.priority }%`
    );
  }
  if (criteria.severity !== undefined) {
    query = query.where(
      'alert_type.severity', 
      criteria.severity === null ? 'is' : 'like', 
      criteria.severity === null ? null : `%${ criteria.severity }%`
    );
  }
  if (criteria.color_code !== undefined) {
    query = query.where(
      'alert_type.color_code', 
      criteria.color_code === null ? 'is' : 'like', 
      criteria.color_code === null ? null : `%${ criteria.color_code }%`
    );
  }
  if (criteria.send_push) {
    query = query.where('alert_type.send_push', '=', criteria.send_push);
  }
  if (criteria.alert_text !== undefined) {
    query = query.where(
      'alert_type.alert_text', 
      criteria.alert_text === null ? 'is' : 'like', 
      criteria.alert_text === null ? null : `%${ criteria.alert_text }%`
    );
  }
  if (criteria.alert_link !== undefined) {
    query = query.where(
      'alert_type.alert_link', 
      criteria.alert_link === null ? 'is' : 'like', 
      criteria.alert_link === null ? null : `%${ criteria.alert_link }%`
    );
  }


  if (criteria.created_by) {
    query = query.where('alert_type.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'alert_type.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
