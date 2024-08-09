export * as AlertType from "./alert_type";
import db from '../database';
import { AlertType, AlertTypeUpdate, NewAlertType } from "../database/alert_type";


export async function create(alert_type: NewAlertType): Promise<{
  entity: AlertType | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('alert_type')
        .select(['id'])
        .where((eb) => eb.or([
            eb('name', '=', alert_type.name),
        ]))
        .where('deleted_by', 'is', null)
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
  entity: AlertType | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('alert_type')
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
        .deleteFrom('alert_type')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<AlertType[]> {
    return db
        .selectFrom("alert_type")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function paginate(page: number, pageSize: number): Promise<AlertType[]> {
    return db
        .selectFrom("alert_type")
        .selectAll()
        .where('deleted_by', 'is', null)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .execute();
}

export async function lazyGet(id: number): Promise<AlertType | undefined> {
    return db
        .selectFrom("alert_type")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<AlertType | undefined> {
    return db
        .selectFrom("alert_type")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<AlertType>): Promise<AlertType[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<AlertType>): Promise<AlertType[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<AlertType>): Promise<AlertType | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<AlertType>): Promise<AlertType | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<AlertType>) {
  let query = db.selectFrom('alert_type').where('deleted_by', 'is', null);

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
  if (criteria.description !== undefined) {
    query = query.where(
      'description', 
      criteria.description === null ? 'is' : '=', 
      criteria.description
    );
  }
  if (criteria.priority !== undefined) {
    query = query.where(
      'priority', 
      criteria.priority === null ? 'is' : '=', 
      criteria.priority
    );
  }
  if (criteria.severity !== undefined) {
    query = query.where(
      'severity', 
      criteria.severity === null ? 'is' : '=', 
      criteria.severity
    );
  }
  if (criteria.color_code !== undefined) {
    query = query.where(
      'color_code', 
      criteria.color_code === null ? 'is' : '=', 
      criteria.color_code
    );
  }
  if (criteria.send_push) {
    query = query.where('send_push', '=', criteria.send_push);
  }
  if (criteria.alert_text !== undefined) {
    query = query.where(
      'alert_text', 
      criteria.alert_text === null ? 'is' : '=', 
      criteria.alert_text
    );
  }
  if (criteria.alert_link !== undefined) {
    query = query.where(
      'alert_link', 
      criteria.alert_link === null ? 'is' : '=', 
      criteria.alert_link
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
