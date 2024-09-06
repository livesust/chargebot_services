export * as ScheduledAlert from "./scheduled_alert";
import db from '../database';
import { UpdateResult } from "kysely";
import { ScheduledAlert, ScheduledAlertUpdate, NewScheduledAlert } from "../database/scheduled_alert";


export async function create(scheduled_alert: NewScheduledAlert): Promise<{
  entity: ScheduledAlert | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('scheduled_alert')
        .select(['id'])
        .where((eb) => eb.or([
            eb('name', '=', scheduled_alert.name),
        ]))
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    const created = await db
        .insertInto('scheduled_alert')
        .values({
            ...scheduled_alert,
            config_settings: scheduled_alert.config_settings ? json(scheduled_alert.config_settings) : undefined,
        })
        .returningAll()
        .executeTakeFirst();
    
    if (!created) {
      return undefined;
    }

    return {
      entity: created,
      event: created
    };
}

export async function update(id: number, scheduled_alert: ScheduledAlertUpdate): Promise<{
  entity: ScheduledAlert | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('scheduled_alert')
        .set({
            ...scheduled_alert,
            config_settings: scheduled_alert.config_settings ? json(scheduled_alert.config_settings) : undefined,
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
  entity: ScheduledAlert | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('scheduled_alert')
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

export async function removeByCriteria(criteria: Partial<ScheduledAlert>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('scheduled_alert')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<ScheduledAlert[]> {
    return db
        .selectFrom("scheduled_alert")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function paginate(page: number, pageSize: number): Promise<ScheduledAlert[]> {
    return db
        .selectFrom("scheduled_alert")
        .selectAll()
        .where('deleted_by', 'is', null)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .execute();
}

export async function lazyGet(id: number): Promise<ScheduledAlert | undefined> {
    return db
        .selectFrom("scheduled_alert")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<ScheduledAlert | undefined> {
    return db
        .selectFrom("scheduled_alert")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<ScheduledAlert>): Promise<ScheduledAlert[]> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<ScheduledAlert>): Promise<ScheduledAlert[]> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<ScheduledAlert>): Promise<ScheduledAlert | undefined> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<ScheduledAlert>): Promise<ScheduledAlert | undefined> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<ScheduledAlert>) {
  let query = db.selectFrom('scheduled_alert');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<ScheduledAlert>) {
  let query = db.updateTable('scheduled_alert');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<ScheduledAlert>): any {
  query = query.where('deleted_by', 'is', null);

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
  if (criteria.config_settings) {
    query = query.where('config_settings', '=', criteria.config_settings);
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
