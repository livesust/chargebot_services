export * as BotCompany from "./bot_company";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotCompany, BotCompanyUpdate, NewBotCompany } from "../database/bot_company";

export function withBot(eb: ExpressionBuilder<Database, 'bot_company'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_company.bot_id')
    ).as('bot')
}

export function withCompany(eb: ExpressionBuilder<Database, 'bot_company'>) {
    return jsonObjectFrom(
      eb.selectFrom('company')
        .selectAll()
        .whereRef('company.id', '=', 'bot_company.company_id')
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
  entity: BotCompany | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_company')
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
        .deleteFrom('bot_company')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotCompany[]> {
    return db
        .selectFrom("bot_company")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function paginate(page: number, pageSize: number): Promise<BotCompany[]> {
    return db
        .selectFrom("bot_company")
        .selectAll()
        .where('deleted_by', 'is', null)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .execute();
}

export async function lazyGet(id: number): Promise<BotCompany | undefined> {
    return db
        .selectFrom("bot_company")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotCompany | undefined> {
    return db
        .selectFrom("bot_company")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withCompany(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotCompany>): Promise<BotCompany[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withBot(eb))
    .select((eb) => withCompany(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotCompany>): Promise<BotCompany[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotCompany>): Promise<BotCompany | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withBot(eb))
    .select((eb) => withCompany(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotCompany>): Promise<BotCompany | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<BotCompany>) {
  let query = db.selectFrom('bot_company').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.acquire_date) {
    query = query.where('acquire_date', '=', criteria.acquire_date);
  }

  if (criteria.bot_id) {
    query = query.where('bot_id', '=', criteria.bot_id);
  }

  if (criteria.company_id) {
    query = query.where('company_id', '=', criteria.company_id);
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
