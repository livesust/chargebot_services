export * as BotCompany from "./bot_company";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotCompany, BotCompanyUpdate, NewBotCompany } from "../database/bot_company";

export function withBot(eb: ExpressionBuilder<Database, 'bot_company'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_company.bot_id')
        .where('bot.deleted_by', 'is', null)
    ).as('bot')
}

export function withCompany(eb: ExpressionBuilder<Database, 'bot_company'>) {
    return jsonObjectFrom(
      eb.selectFrom('company')
        .selectAll()
        .whereRef('company.id', '=', 'bot_company.company_id')
        .where('company.deleted_by', 'is', null)
    ).as('company')
}


export async function create(bot_company: NewBotCompany): Promise<{
  entity: BotCompany | undefined,
  event: unknown
} | undefined> {
    // check if many-to-many record already exists
    const existent = await db
          .selectFrom("bot_company")
          .selectAll()
          .where('bot_id', '=', bot_company.bot_id)
          .where('company_id', '=', bot_company.company_id)
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
        .insertInto('bot_company')
        .values({
            ...bot_company,
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

export async function update(id: number, bot_company: BotCompanyUpdate): Promise<{
  entity: BotCompany | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot_company')
        .set({
            ...bot_company,
        })
        .where('bot_company.id', '=', id)
        .where('bot_company.deleted_by', 'is', null)
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
  entity: BotCompany | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_company')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot_company.id', '=', id)
        .where('bot_company.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<BotCompany>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot_company')
        .where('bot_company.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotCompany[]> {
    return db
        .selectFrom("bot_company")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withCompany(eb))
        .where('bot_company.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<BotCompany>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_company").where('bot_company.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot_company.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<BotCompany>): Promise<BotCompany[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_company").where('bot_company.deleted_by', 'is', null);
  return query
      .selectAll("bot_company")
      .select((eb) => withBot(eb))
      .select((eb) => withCompany(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<BotCompany | undefined> {
    return db
        .selectFrom("bot_company")
        .selectAll()
        .where('bot_company.id', '=', id)
        .where('bot_company.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotCompany | undefined> {
    return db
        .selectFrom("bot_company")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withCompany(eb))
        .where('bot_company.id', '=', id)
        .where('bot_company.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotCompany>): Promise<BotCompany[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_company")
    .select((eb) => withBot(eb))
    .select((eb) => withCompany(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotCompany>): Promise<BotCompany[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_company")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotCompany>): Promise<BotCompany | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_company")
    .select((eb) => withBot(eb))
    .select((eb) => withCompany(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotCompany>): Promise<BotCompany | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_company")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<BotCompany>) {
  let query = db.selectFrom('bot_company');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<BotCompany>) {
  let query = db.updateTable('bot_company');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<BotCompany>): any {
  query = query.where('bot_company.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.acquire_date) {
    query = query.where('bot_company.acquire_date', '=', criteria.acquire_date);
  }

  if (criteria.bot_id) {
    query = query.where('bot_company.bot_id', '=', criteria.bot_id);
  }

  if (criteria.company_id) {
    query = query.where('bot_company.company_id', '=', criteria.company_id);
  }

  if (criteria.created_by) {
    query = query.where('bot_company.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot_company.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
