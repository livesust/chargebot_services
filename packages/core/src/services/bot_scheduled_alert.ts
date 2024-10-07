export * as BotScheduledAlert from "./bot_scheduled_alert";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database, json } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotScheduledAlert, BotScheduledAlertUpdate, NewBotScheduledAlert } from "../database/bot_scheduled_alert";

export function withBot(eb: ExpressionBuilder<Database, 'bot_scheduled_alert'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_scheduled_alert.bot_id')
        .where('bot.deleted_by', 'is', null)
    ).as('bot')
}

export function withScheduledAlert(eb: ExpressionBuilder<Database, 'bot_scheduled_alert'>) {
    return jsonObjectFrom(
      eb.selectFrom('scheduled_alert')
        .selectAll()
        .whereRef('scheduled_alert.id', '=', 'bot_scheduled_alert.scheduled_alert_id')
        .where('scheduled_alert.deleted_by', 'is', null)
    ).as('scheduled_alert')
}


export async function create(bot_scheduled_alert: NewBotScheduledAlert): Promise<{
  entity: BotScheduledAlert | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('bot_scheduled_alert')
        .values({
            ...bot_scheduled_alert,
            settings: bot_scheduled_alert.settings ? json(bot_scheduled_alert.settings) : undefined,
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

export async function update(id: number, bot_scheduled_alert: BotScheduledAlertUpdate): Promise<{
  entity: BotScheduledAlert | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot_scheduled_alert')
        .set({
            ...bot_scheduled_alert,
            settings: bot_scheduled_alert.settings ? json(bot_scheduled_alert.settings) : undefined,
        })
        .where('bot_scheduled_alert.id', '=', id)
        .where('bot_scheduled_alert.deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();

    if (!updated) {
      return undefined;
    }

    return {
      entity: updated,
      event: updated
    };
}

export async function remove(id: number, user_id: string): Promise<{
  entity: BotScheduledAlert | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_scheduled_alert')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot_scheduled_alert.id', '=', id)
        .where('bot_scheduled_alert.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<BotScheduledAlert>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot_scheduled_alert')
        .where('bot_scheduled_alert.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotScheduledAlert[]> {
    return db
        .selectFrom("bot_scheduled_alert")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withScheduledAlert(eb))
        .where('bot_scheduled_alert.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<BotScheduledAlert>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_scheduled_alert").where('bot_scheduled_alert.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot_scheduled_alert.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<BotScheduledAlert>): Promise<BotScheduledAlert[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_scheduled_alert").where('bot_scheduled_alert.deleted_by', 'is', null);
  return query
      .selectAll("bot_scheduled_alert")
      .select((eb) => withBot(eb))
      .select((eb) => withScheduledAlert(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<BotScheduledAlert | undefined> {
    return db
        .selectFrom("bot_scheduled_alert")
        .selectAll()
        .where('bot_scheduled_alert.id', '=', id)
        .where('bot_scheduled_alert.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotScheduledAlert | undefined> {
    return db
        .selectFrom("bot_scheduled_alert")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withScheduledAlert(eb))
        .where('bot_scheduled_alert.id', '=', id)
        .where('bot_scheduled_alert.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByScheduledAlert(scheduledAlertName: string): Promise<BotScheduledAlert[]> {
  const query = db.selectFrom('bot_scheduled_alert')
    .innerJoin('scheduled_alert', 'scheduled_alert.id', 'bot_scheduled_alert.scheduled_alert_id')
    .where('bot_scheduled_alert.deleted_by', 'is', null)
    .where('scheduled_alert.deleted_by', 'is', null)
    .where('scheduled_alert.name', '=', scheduledAlertName)
    .where('bot_scheduled_alert.alert_status', '=', true);

  return query
    .selectAll('bot_scheduled_alert')
    .select((eb) => withBot(eb))
    .select((eb) => withScheduledAlert(eb))
    .execute();
}

export async function findByCriteria(criteria: Partial<BotScheduledAlert>): Promise<BotScheduledAlert[]> {
  return buildSelectQuery(criteria)
    .selectAll('bot_scheduled_alert')
    .select((eb) => withBot(eb))
    .select((eb) => withScheduledAlert(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotScheduledAlert>): Promise<BotScheduledAlert[]> {
  return buildSelectQuery(criteria)
    .selectAll('bot_scheduled_alert')
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotScheduledAlert>): Promise<BotScheduledAlert | undefined> {
  return buildSelectQuery(criteria)
    .selectAll('bot_scheduled_alert')
    .select((eb) => withBot(eb))
    .select((eb) => withScheduledAlert(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotScheduledAlert>): Promise<BotScheduledAlert | undefined> {
  return buildSelectQuery(criteria)
    .selectAll('bot_scheduled_alert')
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<BotScheduledAlert>) {
  let query = db.selectFrom('bot_scheduled_alert');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<BotScheduledAlert>) {
  let query = db.updateTable('bot_scheduled_alert');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<BotScheduledAlert>): any {
  query = query.where('bot_scheduled_alert.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.alert_status) {
    query = query.where('bot_scheduled_alert.alert_status', '=', criteria.alert_status);
  }
  if (criteria.settings) {
    query = query.where('bot_scheduled_alert.settings', '=', criteria.settings);
  }

  if (criteria.bot_id) {
    query = query.where('bot_scheduled_alert.bot_id', '=', criteria.bot_id);
  }
  if (criteria.scheduled_alert_id) {
    query = query.where('bot_scheduled_alert.scheduled_alert_id', '=', criteria.scheduled_alert_id);
  }

  if (criteria.created_by) {
    query = query.where('bot_scheduled_alert.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot_scheduled_alert.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
