export * as BotStatus from "./bot_status";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db from '../database';
import { UpdateResult } from "kysely";
import { BotStatus, BotStatusUpdate, NewBotStatus } from "../database/bot_status";


export async function create(bot_status: NewBotStatus): Promise<{
  entity: BotStatus | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('bot_status')
        .values({
            ...bot_status,
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

export async function update(id: number, bot_status: BotStatusUpdate): Promise<{
  entity: BotStatus | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot_status')
        .set({
            ...bot_status,
        })
        .where('bot_status.id', '=', id)
        .where('bot_status.deleted_by', 'is', null)
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
  entity: BotStatus | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_status')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot_status.id', '=', id)
        .where('bot_status.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<BotStatus>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot_status')
        .where('bot_status.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotStatus[]> {
    return db
        .selectFrom("bot_status")
        .selectAll()
        .where('bot_status.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<BotStatus>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_status").where('bot_status.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot_status.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<BotStatus>): Promise<BotStatus[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_status").where('bot_status.deleted_by', 'is', null);
  return query
      .selectAll("bot_status")
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<BotStatus | undefined> {
    return db
        .selectFrom("bot_status")
        .selectAll("bot_status")
        .where('bot_status.id', '=', id)
        .where('bot_status.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotStatus | undefined> {
    return db
        .selectFrom("bot_status")
        .selectAll("bot_status")
        .where('bot_status.id', '=', id)
        .where('bot_status.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotStatus>): Promise<BotStatus[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_status")
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotStatus>): Promise<BotStatus[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_status")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotStatus>): Promise<BotStatus | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_status")
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotStatus>): Promise<BotStatus | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_status")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<BotStatus>) {
  let query = db.selectFrom('bot_status');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<BotStatus>) {
  let query = db.updateTable('bot_status');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<BotStatus>): any {
  query = query.where('bot_status.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.name !== undefined) {
    query = query.where(
      'bot_status.name', 
      criteria.name === null ? 'is' : 'like', 
      criteria.name === null ? null : `%${ criteria.name }%`
    );
  }
  if (criteria.display_on_dashboard) {
    query = query.where('bot_status.display_on_dashboard', '=', criteria.display_on_dashboard);
  }


  if (criteria.created_by) {
    query = query.where('bot_status.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot_status.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
