export * as BotFirmwareInstall from "./bot_firmware_install";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotFirmwareInstall, BotFirmwareInstallUpdate, NewBotFirmwareInstall } from "../database/bot_firmware_install";

export function withBot(eb: ExpressionBuilder<Database, 'bot_firmware_install'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_firmware_install.bot_id')
        .where('bot.deleted_by', 'is', null)
    ).as('bot')
}

export function withBotFirmwareVersion(eb: ExpressionBuilder<Database, 'bot_firmware_install'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot_firmware_version')
        .selectAll()
        .whereRef('bot_firmware_version.id', '=', 'bot_firmware_install.bot_firmware_version_id')
        .where('bot_firmware_version.deleted_by', 'is', null)
    ).as('bot_firmware_version')
}


export async function create(bot_firmware_install: NewBotFirmwareInstall): Promise<{
  entity: BotFirmwareInstall | undefined,
  event: unknown
} | undefined> {
    // check if many-to-many record already exists
    const existent = await db
          .selectFrom("bot_firmware_install")
          .selectAll()
          .where('bot_id', '=', bot_firmware_install.bot_id)
          .where('bot_firmware_version_id', '=', bot_firmware_install.bot_firmware_version_id)
          .where('deleted_by', 'is', null)
          .executeTakeFirst();
    if (existent) {
        // return existent many-to-many record, do not create a new one
        return {
          entity: existent,
          // event to dispatch on EventBus on creation
          // undefined when entity already exists
          event: undefined
        };
    }
    const created = await db
        .insertInto('bot_firmware_install')
        .values({
            ...bot_firmware_install,
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

export async function update(id: number, bot_firmware_install: BotFirmwareInstallUpdate): Promise<{
  entity: BotFirmwareInstall | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot_firmware_install')
        .set({
            ...bot_firmware_install,
        })
        .where('bot_firmware_install.id', '=', id)
        .where('bot_firmware_install.deleted_by', 'is', null)
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
  entity: BotFirmwareInstall | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_firmware_install')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot_firmware_install.id', '=', id)
        .where('bot_firmware_install.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<BotFirmwareInstall>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot_firmware_install')
        .where('bot_firmware_install.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotFirmwareInstall[]> {
    return db
        .selectFrom("bot_firmware_install")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withBotFirmwareVersion(eb))
        .where('bot_firmware_install.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<BotFirmwareInstall>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_firmware_install").where('bot_firmware_install.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot_firmware_install.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<BotFirmwareInstall>): Promise<BotFirmwareInstall[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_firmware_install").where('bot_firmware_install.deleted_by', 'is', null);
  return query
      .selectAll("bot_firmware_install")
      .select((eb) => withBot(eb))
      .select((eb) => withBotFirmwareVersion(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<BotFirmwareInstall | undefined> {
    return db
        .selectFrom("bot_firmware_install")
        .selectAll()
        .where('bot_firmware_install.id', '=', id)
        .where('bot_firmware_install.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotFirmwareInstall | undefined> {
    return db
        .selectFrom("bot_firmware_install")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withBotFirmwareVersion(eb))
        .where('bot_firmware_install.id', '=', id)
        .where('bot_firmware_install.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotFirmwareInstall>): Promise<BotFirmwareInstall[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_firmware_install")
    .select((eb) => withBot(eb))
    .select((eb) => withBotFirmwareVersion(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotFirmwareInstall>): Promise<BotFirmwareInstall[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_firmware_install")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotFirmwareInstall>): Promise<BotFirmwareInstall | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_firmware_install")
    .select((eb) => withBot(eb))
    .select((eb) => withBotFirmwareVersion(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotFirmwareInstall>): Promise<BotFirmwareInstall | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_firmware_install")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<BotFirmwareInstall>) {
  let query = db.selectFrom('bot_firmware_install');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<BotFirmwareInstall>) {
  let query = db.updateTable('bot_firmware_install');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<BotFirmwareInstall>): any {
  query = query.where('bot_firmware_install.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.install_date) {
    query = query.where('bot_firmware_install.install_date', '=', criteria.install_date);
  }
  if (criteria.active) {
    query = query.where('bot_firmware_install.active', '=', criteria.active);
  }

  if (criteria.bot_id) {
    query = query.where('bot_firmware_install.bot_id', '=', criteria.bot_id);
  }

  if (criteria.bot_firmware_version_id) {
    query = query.where('bot_firmware_install.bot_firmware_version_id', '=', criteria.bot_firmware_version_id);
  }

  if (criteria.created_by) {
    query = query.where('bot_firmware_install.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot_firmware_install.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
