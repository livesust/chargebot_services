export * as BotFirmwareVersion from "./bot_firmware_version";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db from '../database';
import { UpdateResult } from "kysely";
import { BotFirmwareVersion, BotFirmwareVersionUpdate, NewBotFirmwareVersion } from "../database/bot_firmware_version";


export async function create(bot_firmware_version: NewBotFirmwareVersion): Promise<{
  entity: BotFirmwareVersion | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('bot_firmware_version')
        .select(['bot_firmware_version.id'])
        .where((eb) => eb.or([
            eb('bot_firmware_version.version_number', '=', bot_firmware_version.version_number),
            eb('bot_firmware_version.version_name', '=', bot_firmware_version.version_name),
        ]))
        .where('bot_firmware_version.deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    const created = await db
        .insertInto('bot_firmware_version')
        .values({
            ...bot_firmware_version,
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

export async function update(id: number, bot_firmware_version: BotFirmwareVersionUpdate): Promise<{
  entity: BotFirmwareVersion | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot_firmware_version')
        .set({
            ...bot_firmware_version,
        })
        .where('bot_firmware_version.id', '=', id)
        .where('bot_firmware_version.deleted_by', 'is', null)
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
  entity: BotFirmwareVersion | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_firmware_version')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot_firmware_version.id', '=', id)
        .where('bot_firmware_version.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<BotFirmwareVersion>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot_firmware_version')
        .where('bot_firmware_version.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotFirmwareVersion[]> {
    return db
        .selectFrom("bot_firmware_version")
        .selectAll()
        .where('bot_firmware_version.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<BotFirmwareVersion>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_firmware_version").where('bot_firmware_version.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot_firmware_version.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<BotFirmwareVersion>): Promise<BotFirmwareVersion[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_firmware_version").where('bot_firmware_version.deleted_by', 'is', null);
  return query
      .selectAll("bot_firmware_version")
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<BotFirmwareVersion | undefined> {
    return db
        .selectFrom("bot_firmware_version")
        .selectAll()
        .where('bot_firmware_version.id', '=', id)
        .where('bot_firmware_version.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotFirmwareVersion | undefined> {
    return db
        .selectFrom("bot_firmware_version")
        .selectAll()
        .where('bot_firmware_version.id', '=', id)
        .where('bot_firmware_version.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotFirmwareVersion>): Promise<BotFirmwareVersion[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_firmware_version")
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotFirmwareVersion>): Promise<BotFirmwareVersion[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_firmware_version")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotFirmwareVersion>): Promise<BotFirmwareVersion | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_firmware_version")
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotFirmwareVersion>): Promise<BotFirmwareVersion | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_firmware_version")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<BotFirmwareVersion>) {
  let query = db.selectFrom('bot_firmware_version');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<BotFirmwareVersion>) {
  let query = db.updateTable('bot_firmware_version');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<BotFirmwareVersion>): any {
  query = query.where('bot_firmware_version.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.version_number !== undefined) {
    query = query.where(
      'bot_firmware_version.version_number', 
      criteria.version_number === null ? 'is' : 'like', 
      criteria.version_number === null ? null : `%${ criteria.version_number }%`
    );
  }
  if (criteria.version_name !== undefined) {
    query = query.where(
      'bot_firmware_version.version_name', 
      criteria.version_name === null ? 'is' : 'like', 
      criteria.version_name === null ? null : `%${ criteria.version_name }%`
    );
  }
  if (criteria.notes !== undefined) {
    query = query.where(
      'bot_firmware_version.notes', 
      criteria.notes === null ? 'is' : 'like', 
      criteria.notes === null ? null : `%${ criteria.notes }%`
    );
  }
  if (criteria.active_date) {
    query = query.where('bot_firmware_version.active_date', '=', criteria.active_date);
  }


  if (criteria.created_by) {
    query = query.where('bot_firmware_version.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot_firmware_version.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
