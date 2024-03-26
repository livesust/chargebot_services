export * as BotVersion from "./bot_version";
import db from '../database';
import { BotVersion, BotVersionUpdate, NewBotVersion } from "../database/bot_version";


export async function create(bot_version: NewBotVersion): Promise<{
  entity: BotVersion | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('bot_version')
        .select(['id'])
        .where((eb) => eb.or([
            eb('version_number', '=', bot_version.version_number),
            eb('version_name', '=', bot_version.version_name),
        ]))
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    const created = await db
        .insertInto('bot_version')
        .values({
            ...bot_version,
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

export async function update(id: number, bot_version: BotVersionUpdate): Promise<{
  entity: BotVersion | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot_version')
        .set(bot_version)
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
  entity: BotVersion | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_version')
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
        .deleteFrom('bot_version')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotVersion[]> {
    return db
        .selectFrom("bot_version")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<BotVersion | undefined> {
    return db
        .selectFrom("bot_version")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotVersion>): Promise<BotVersion[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotVersion>): Promise<BotVersion | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<BotVersion>) {
  let query = db.selectFrom('bot_version').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.version_number !== undefined) {
    query = query.where(
      'version_number', 
      criteria.version_number === null ? 'is' : '=', 
      criteria.version_number
    );
  }
  if (criteria.version_name !== undefined) {
    query = query.where(
      'version_name', 
      criteria.version_name === null ? 'is' : '=', 
      criteria.version_name
    );
  }
  if (criteria.notes !== undefined) {
    query = query.where(
      'notes', 
      criteria.notes === null ? 'is' : '=', 
      criteria.notes
    );
  }
  if (criteria.active_date) {
    query = query.where('active_date', '=', criteria.active_date);
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
