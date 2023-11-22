export * as BotUser from "./bot_user";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { BotUser, BotUserUpdate, NewBotUser } from "../database/bot_user";

function withBot(eb: ExpressionBuilder<Database, 'bot_user'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot')
        .selectAll()
        .whereRef('bot.id', '=', 'bot_user.bot_id')
    ).as('bot')
}
function withUser(eb: ExpressionBuilder<Database, 'bot_user'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'bot_user.user_id')
    ).as('user')
}

export async function create(bot_user: NewBotUser): Promise<BotUser | undefined> {
    return await db
        .insertInto('bot_user')
        .values(bot_user)
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, bot_user: BotUserUpdate): Promise<BotUser | undefined> {
    return await db
        .updateTable('bot_user')
        .set(bot_user)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('bot_user')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<{ id: number | undefined } | undefined> {
    return await db
        .deleteFrom('bot_user')
        .where('id', '=', id)
        .returning(['id'])
        .executeTakeFirst();
}

export async function list(): Promise<BotUser[]> {
    return await db
        .selectFrom("bot_user")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<BotUser | undefined> {
    return await db
        .selectFrom("bot_user")
        .selectAll()
        // uncoment to enable eager loading
        //.select((eb) => withBot(eb))
        // uncoment to enable eager loading
        //.select((eb) => withUser(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotUser>) {
  let query = db.selectFrom('bot_user').where('deleted_by', 'is', null)

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.assignment_date) {
    query = query.where('assignment_date', '=', criteria.assignment_date);
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
