export * as BotFirmware from "./bot_firmware";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotFirmware, BotFirmwareUpdate, NewBotFirmware } from "../database/bot_firmware";

export function withBot(eb: ExpressionBuilder<Database, 'bot_firmware'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_firmware.bot_id')
        .where('bot.deleted_by', 'is', null)
    ).as('bot')
}


export async function create(bot_firmware: NewBotFirmware): Promise<{
  entity: BotFirmware | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('bot_firmware')
        .values({
            ...bot_firmware,
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

export async function update(id: number, bot_firmware: BotFirmwareUpdate): Promise<{
  entity: BotFirmware | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot_firmware')
        .set({
            ...bot_firmware,
        })
        .where('bot_firmware.id', '=', id)
        .where('bot_firmware.deleted_by', 'is', null)
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
  entity: BotFirmware | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_firmware')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot_firmware.id', '=', id)
        .where('bot_firmware.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<BotFirmware>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot_firmware')
        .where('bot_firmware.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotFirmware[]> {
    return db
        .selectFrom("bot_firmware")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withBot(eb))
        .where('bot_firmware.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<BotFirmware>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_firmware").where('bot_firmware.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot_firmware.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<BotFirmware>): Promise<BotFirmware[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_firmware").where('bot_firmware.deleted_by', 'is', null);
  return query
      .selectAll("bot_firmware")
      // uncoment to enable eager loading
      //.select((eb) => withBot(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<BotFirmware | undefined> {
    return db
        .selectFrom("bot_firmware")
        .selectAll()
        .where('bot_firmware.id', '=', id)
        .where('bot_firmware.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotFirmware | undefined> {
    return db
        .selectFrom("bot_firmware")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withBot(eb))
        .where('bot_firmware.id', '=', id)
        .where('bot_firmware.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotFirmware>): Promise<BotFirmware[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_firmware")
    // uncoment to enable eager loading
    //.select((eb) => withBot(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotFirmware>): Promise<BotFirmware[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_firmware")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotFirmware>): Promise<BotFirmware | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_firmware")
    // uncoment to enable eager loading
    //.select((eb) => withBot(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotFirmware>): Promise<BotFirmware | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_firmware")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<BotFirmware>) {
  let query = db.selectFrom('bot_firmware');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<BotFirmware>) {
  let query = db.updateTable('bot_firmware');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<BotFirmware>): any {
  query = query.where('bot_firmware.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.inverter_version !== undefined) {
    query = query.where(
      'bot_firmware.inverter_version', 
      criteria.inverter_version === null ? 'is' : 'like', 
      criteria.inverter_version === null ? null : `%${ criteria.inverter_version }%`
    );
  }
  if (criteria.pi_version !== undefined) {
    query = query.where(
      'bot_firmware.pi_version', 
      criteria.pi_version === null ? 'is' : 'like', 
      criteria.pi_version === null ? null : `%${ criteria.pi_version }%`
    );
  }
  if (criteria.firmware_version !== undefined) {
    query = query.where(
      'bot_firmware.firmware_version', 
      criteria.firmware_version === null ? 'is' : 'like', 
      criteria.firmware_version === null ? null : `%${ criteria.firmware_version }%`
    );
  }
  if (criteria.battery_version !== undefined) {
    query = query.where(
      'bot_firmware.battery_version', 
      criteria.battery_version === null ? 'is' : 'like', 
      criteria.battery_version === null ? null : `%${ criteria.battery_version }%`
    );
  }
  if (criteria.pdu_version !== undefined) {
    query = query.where(
      'bot_firmware.pdu_version', 
      criteria.pdu_version === null ? 'is' : 'like', 
      criteria.pdu_version === null ? null : `%${ criteria.pdu_version }%`
    );
  }
  if (criteria.notes !== undefined) {
    query = query.where(
      'bot_firmware.notes', 
      criteria.notes === null ? 'is' : 'like', 
      criteria.notes === null ? null : `%${ criteria.notes }%`
    );
  }

  if (criteria.bot_id) {
    query = query.where('bot_firmware.bot_id', '=', criteria.bot_id);
  }

  if (criteria.created_by) {
    query = query.where('bot_firmware.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot_firmware.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
