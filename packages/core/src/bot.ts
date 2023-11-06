export * as Bot from "./bot";
import db from './model';

export async function create(bot: any, user_id: string) {
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

export async function update(id: number, update: any, user_id: string) {
    return await db
        .updateTable('bot')
        .set({
            ...update,
            modified_date: new Date(),
            modified_by: user_id
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string) {
    await db
        .updateTable('bot')
        .set({
            deleted_date: new Date(),
            deleted_by: user_id
        })
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list() {
    return await db
        .selectFrom("bot")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number) {
    return await db
        .selectFrom("bot")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get_by_uuid(uuid: string) {
    return await db
        .selectFrom("bot")
        .selectAll()
        .where('bot_uuid', '=', uuid)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}
