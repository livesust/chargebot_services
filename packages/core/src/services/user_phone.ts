export * as UserPhone from "./user_phone";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { UserPhone, UserPhoneUpdate, NewUserPhone } from "../database/user_phone";


export async function create(user_phone: NewUserPhone): Promise<UserPhone | undefined> {
    const exists = await db
        .selectFrom('user_phone')
        .select(['id'])
        .where((eb) => eb.or([
            eb('phone_number', '=', user_phone.phone_number),
        ]))
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    return await db
        .insertInto('user_phone')
        .values({
            ...user_phone,
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, user_phone: UserPhoneUpdate): Promise<UserPhone | undefined> {
    return await db
        .updateTable('user_phone')
        .set(user_phone)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('user_phone')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('user_phone')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<UserPhone[]> {
    return await db
        .selectFrom("user_phone")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<UserPhone | undefined> {
    return await db
        .selectFrom("user_phone")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<UserPhone>): Promise<UserPhone[]> {
  let query = db.selectFrom('user_phone').where('deleted_by', 'is', null)

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.phone_number !== undefined) {
    query = query.where(
      'phone_number', 
      criteria.phone_number === null ? 'is' : '=', 
      criteria.phone_number
    );
  }
  if (criteria.send_text) {
    query = query.where('send_text', '=', criteria.send_text);
  }
  if (criteria.primary) {
    query = query.where('primary', '=', criteria.primary);
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

  return await query
    .selectAll()
    .execute();
}
