export * as Bot from "./bot";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { Bot, BotUpdate, NewBot } from "../database/bot";

function withBotVersion(eb: ExpressionBuilder<Database, 'bot'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot_version')
        .selectAll()
        .whereRef('bot_version.id', '=', 'bot.bot_version_id')
    ).as('bot_version')
}

function withVehicle(eb: ExpressionBuilder<Database, 'bot'>) {
    return jsonObjectFrom(
      eb.selectFrom('vehicle')
        .selectAll()
        .whereRef('vehicle.id', '=', 'bot.vehicle_id')
    ).as('vehicle')
}


export async function create(bot: NewBot): Promise<{
  entity: Bot | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('bot')
        .select(['id'])
        .where((eb) => eb.or([
            eb('bot_uuid', '=', bot.bot_uuid),
        ]))
        .where('deleted_by', 'is', null)
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
        .set(bot)
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
  entity: Bot | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot')
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
    await db
        .deleteFrom('bot')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Bot[]> {
    return await db
        .selectFrom("bot")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<Bot | undefined> {
    return await db
        .selectFrom("bot")
        .selectAll()
        .select((eb) => withBotVersion(eb))
        .select((eb) => withVehicle(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Bot>): Promise<Bot[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withBotVersion(eb))
    .select((eb) => withVehicle(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Bot>): Promise<Bot | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withBotVersion(eb))
    .select((eb) => withVehicle(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<Bot>) {
  let query = db.selectFrom('bot').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.bot_uuid !== undefined) {
    query = query.where(
      'bot_uuid', 
      criteria.bot_uuid === null ? 'is' : '=', 
      criteria.bot_uuid
    );
  }
  if (criteria.initials !== undefined) {
    query = query.where(
      'initials', 
      criteria.initials === null ? 'is' : '=', 
      criteria.initials
    );
  }
  if (criteria.name !== undefined) {
    query = query.where(
      'name', 
      criteria.name === null ? 'is' : '=', 
      criteria.name
    );
  }
  if (criteria.pin_color !== undefined) {
    query = query.where(
      'pin_color', 
      criteria.pin_color === null ? 'is' : '=', 
      criteria.pin_color
    );
  }

  if (criteria.bot_version_id) {
    query = query.where('bot_version_id', '=', criteria.bot_version_id);
  }
  if (criteria.vehicle_id) {
    query = query.where('vehicle_id', '=', criteria.vehicle_id);
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
