export * as Bot from "./bot";
import db from '../database';
import { Bot, BotUpdate, NewBot } from "../database/bot";

export async function create(bot: NewBot, user_id: string): Promise<Bot | undefined> {
    return await db
        .insertInto('bot')
        .values({
            ...bot,
            created_date: new Date(),
            created_by: user_id
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, update: BotUpdate, user_id: string): Promise<Bot | undefined> {
    return await db
        .updateTable('bot')
        .set({
            ...update,
            modified_date: new Date(),
            modified_by: user_id
        })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('bot')
        .set({
            deleted_date: new Date(),
            deleted_by: user_id
        })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
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
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Bot>) {
  let query = db.selectFrom('bot').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.bot_uuid) {
    query = query.where('bot_uuid', '=', criteria.bot_uuid);
  }

  if (criteria.name !== undefined) {
    query = query.where(
      'name', 
      criteria.name === null ? 'is' : '=', 
      criteria.name
    );
  }

  if (criteria.initials !== undefined) {
    query = query.where(
      'initials', 
      criteria.initials === null ? 'is' : '=', 
      criteria.initials
    );
  }

  if (criteria.pin_color !== undefined) {
    query = query.where(
      'pin_color', 
      criteria.pin_color === null ? 'is' : '=', 
      criteria.pin_color
    );
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
