export * as Bot from "./bot";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, sql, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { Bot, BotUpdate, NewBot } from "../database/bot";

export function withBotStatus(eb: ExpressionBuilder<Database, 'bot'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot_status')
        .selectAll()
        .whereRef('bot_status.id', '=', 'bot.bot_status_id')
        .where('bot_status.deleted_by', 'is', null)
    ).as('bot_status')
}

export function withBotModel(eb: ExpressionBuilder<Database, 'bot'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot_model')
        .selectAll()
        .whereRef('bot_model.id', '=', 'bot.bot_model_id')
        .where('bot_model.deleted_by', 'is', null)
    ).as('bot_model')
}

export function withVehicle(eb: ExpressionBuilder<Database, 'bot'>) {
    return jsonObjectFrom(
      eb.selectFrom('vehicle')
        .selectAll()
        .whereRef('vehicle.id', '=', 'bot.vehicle_id')
        .where('vehicle.deleted_by', 'is', null)
    ).as('vehicle')
}


export async function create(bot: NewBot): Promise<{
  entity: Bot | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('bot')
        .select(['bot.id'])
        .where((eb) => eb.or([
            eb('bot.bot_uuid', '=', bot.bot_uuid),
        ]))
        .where('bot.deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    const created = await db
        .insertInto('bot')
        .values({
            ...bot,
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

export async function update(id: number, bot: BotUpdate): Promise<{
  entity: Bot | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot')
        .set({
            ...bot,
        })
        .where('bot.id', '=', id)
        .where('bot.deleted_by', 'is', null)
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
  entity: Bot | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot.id', '=', id)
        .where('bot.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<Bot>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot')
        .where('bot.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Bot[]> {
    return db
        .selectFrom("bot")
        .selectAll()
        .select((eb) => withBotStatus(eb))
        .select((eb) => withBotModel(eb))
        .select((eb) => withVehicle(eb))
        .where('bot.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<Bot>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot").where('bot.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<Bot>): Promise<Bot[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot").where('bot.deleted_by', 'is', null);
  return query
      .selectAll("bot")
      .select((eb) => withBotStatus(eb))
      .select((eb) => withBotModel(eb))
      .select((eb) => withVehicle(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<Bot | undefined> {
    return db
        .selectFrom("bot")
        .selectAll("bot")
        .where('bot.id', '=', id)
        .where('bot.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<Bot | undefined> {
    return db
        .selectFrom("bot")
        .selectAll("bot")
        .select((eb) => withBotStatus(eb))
        .select((eb) => withBotModel(eb))
        .select((eb) => withVehicle(eb))
        .where('bot.id', '=', id)
        .where('bot.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Bot>): Promise<Bot[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot")
    .select((eb) => withBotStatus(eb))
    .select((eb) => withBotModel(eb))
    .select((eb) => withVehicle(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<Bot>): Promise<Bot[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Bot>): Promise<Bot | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot")
    .select((eb) => withBotStatus(eb))
    .select((eb) => withBotModel(eb))
    .select((eb) => withVehicle(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<Bot>): Promise<Bot | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot")
    .limit(1)
    .executeTakeFirst();
}

export async function addAttachment(id: number, attachment: string): Promise<Bot | undefined> {
    return await db
        .updateTable('bot')
        .set({
          attachments: sql`CASE 
              WHEN array_position(attachments, ${attachment}::text) IS NULL THEN 
                  COALESCE(attachments, ARRAY[]::text[])::text[] || ARRAY[${attachment}::text]::text[]
              ELSE attachments
          END`
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();
}

export async function removeAttachment(id: number, attachment: string): Promise<Bot | undefined> {
    return await db
        .updateTable('bot')
        // @ts-expect-error not overloads match
        .set(() => ({
          attachments: sql`array_remove(attachments, ${attachment}::text)`
        }))
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<Bot>) {
  let query = db.selectFrom('bot');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<Bot>) {
  let query = db.updateTable('bot');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<Bot>): any {
  query = query.where('bot.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.bot_uuid !== undefined) {
    query = query.where(
      'bot.bot_uuid', 
      criteria.bot_uuid === null ? 'is' : 'like', 
      criteria.bot_uuid === null ? null : `%${ criteria.bot_uuid }%`
    );
  }
  if (criteria.initials !== undefined) {
    query = query.where(
      'bot.initials', 
      criteria.initials === null ? 'is' : 'like', 
      criteria.initials === null ? null : `%${ criteria.initials }%`
    );
  }
  if (criteria.name !== undefined) {
    query = query.where(
      'bot.name', 
      criteria.name === null ? 'is' : 'like', 
      criteria.name === null ? null : `%${ criteria.name }%`
    );
  }
  if (criteria.notes !== undefined) {
    query = query.where(
      'bot.notes', 
      criteria.notes === null ? 'is' : 'like', 
      criteria.notes === null ? null : `%${ criteria.notes }%`
    );
  }
  if (criteria.pin_color !== undefined) {
    query = query.where(
      'bot.pin_color', 
      criteria.pin_color === null ? 'is' : 'like', 
      criteria.pin_color === null ? null : `%${ criteria.pin_color }%`
    );
  }
  if (criteria.attachments !== undefined) {
    query = query.where(sql`array_position('bot.attachments', ${ criteria.attachments }) IS NOT NULL`);
  }

  if (criteria.bot_status_id) {
    query = query.where('bot.bot_status_id', '=', criteria.bot_status_id);
  }
  if (criteria.bot_model_id) {
    query = query.where('bot.bot_model_id', '=', criteria.bot_model_id);
  }
  if (criteria.vehicle_id) {
    query = query.where('bot.vehicle_id', '=', criteria.vehicle_id);
  }

  if (criteria.created_by) {
    query = query.where('bot.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
