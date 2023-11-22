export * as BotCompany from "./bot_company";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotCompany, BotCompanyUpdate, NewBotCompany } from "../database/bot_company";

function withBot(eb: ExpressionBuilder<Database, 'bot_company'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_company.bot_id')
    ).as('bot')
}
function withCompany(eb: ExpressionBuilder<Database, 'bot_company'>) {
    return jsonObjectFrom(
      eb.selectFrom('company')
        .selectAll()
        .whereRef('company.id', '=', 'bot_company.company_id')
    ).as('company')
}

export async function create(bot_company: NewBotCompany): Promise<BotCompany | undefined> {
    return await db
        .insertInto('bot_company')
        .values(bot_company)
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, bot_company: BotCompanyUpdate): Promise<BotCompany | undefined> {
    return await db
        .updateTable('bot_company')
        .set(bot_company)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('bot_company')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<{ id: number | undefined } | undefined> {
    return await db
        .deleteFrom('bot_company')
        .where('id', '=', id)
        .returning(['id'])
        .executeTakeFirst();
}

export async function list(): Promise<BotCompany[]> {
    return await db
        .selectFrom("bot_company")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<BotCompany | undefined> {
    return await db
        .selectFrom("bot_company")
        .selectAll()
        .select((eb) => withBot(eb))
        .select((eb) => withCompany(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotCompany>) {
  let query = db.selectFrom('bot_company').where('deleted_by', 'is', null)

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.acquire_date) {
    query = query.where('acquire_date', '=', criteria.acquire_date);
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

  return await query.selectAll().execute();
}
