export * as UserRole from "./user_role";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { UserRole, UserRoleUpdate, NewUserRole } from "../database/user_role";

function withUser(eb: ExpressionBuilder<Database, 'user_role'>) {
    return jsonObjectFrom(
      eb.selectFrom('user')
        .selectAll()
        .whereRef('user.id', '=', 'user_role.user_id')
    ).as('user')
}
function withRole(eb: ExpressionBuilder<Database, 'user_role'>) {
    return jsonObjectFrom(
      eb.selectFrom('role')
        .selectAll()
        .whereRef('role.id', '=', 'user_role.role_id')
    ).as('role')
}

export async function create(user_role: NewUserRole): Promise<UserRole | undefined> {
    // check if many-to-many record already exists
    const existent = await db
          .selectFrom("user_role")
          .selectAll()
          .where('user_id', '=', user_role.user_id)
          .where('role_id', '=', user_role.role_id)
          .where('deleted_by', 'is', null)
          .executeTakeFirst();
    if (existent) {
        // return existent many-to-many record, do not create a new one
        return existent;
    }
    return await db
        .insertInto('user_role')
        .values({
            ...user_role,
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, user_role: UserRoleUpdate): Promise<UserRole | undefined> {
    return await db
        .updateTable('user_role')
        .set(user_role)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('user_role')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('user_role')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<UserRole[]> {
    return await db
        .selectFrom("user_role")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<UserRole | undefined> {
    return await db
        .selectFrom("user_role")
        .selectAll()
        .select((eb) => withUser(eb))
        .select((eb) => withRole(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<UserRole>): Promise<UserRole[]> {
  let query = db.selectFrom('user_role').where('deleted_by', 'is', null)

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.all_bots) {
    query = query.where('all_bots', '=', criteria.all_bots);
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
    .select((eb) => withUser(eb))
    .select((eb) => withRole(eb))
    .execute();
}
