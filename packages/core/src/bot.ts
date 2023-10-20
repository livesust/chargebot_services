export * as Bot from "./bot";
import db from './model';

export async function create(bot: any) {
  return await db
    .insertInto('bot')
    .values(bot)
    .executeTakeFirst();
}

export async function update(id: number, update: any) {
  return await db
    .updateTable('bot')
    .set(update)
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function remove(id: number) {
  await db
    .deleteFrom('bot')
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function list() {
  return await db
    .selectFrom("bot")
    .selectAll()
    .execute();
}

export async function get(id: number) {
  return await db
    .selectFrom("bot")
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
}
