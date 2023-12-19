export * as StateMaster from "./state_master";
import db from '../database';
import { StateMaster, StateMasterUpdate, NewStateMaster } from "../database/state_master";


export async function create(state_master: NewStateMaster): Promise<StateMaster | undefined> {
    const exists = await db
        .selectFrom('state_master')
        .select(['id'])
        .where((eb) => eb.or([
            eb('name', '=', state_master.name),
            eb('abbreviation', '=', state_master.abbreviation),
        ]))
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
    if (exists) {
        throw Error('Entity already exists with unique values');
    }
    return await db
        .insertInto('state_master')
        .values({
            ...state_master,
        })
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, state_master: StateMasterUpdate): Promise<StateMaster | undefined> {
    return await db
        .updateTable('state_master')
        .set(state_master)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('state_master')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('state_master')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<StateMaster[]> {
    return await db
        .selectFrom("state_master")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<StateMaster | undefined> {
    return await db
        .selectFrom("state_master")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<StateMaster>): Promise<StateMaster[]> {
  let query = db.selectFrom('state_master').where('deleted_by', 'is', null)

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.name !== undefined) {
    query = query.where(
      'name', 
      criteria.name === null ? 'is' : '=', 
      criteria.name
    );
  }
  if (criteria.abbreviation !== undefined) {
    query = query.where(
      'abbreviation', 
      criteria.abbreviation === null ? 'is' : '=', 
      criteria.abbreviation
    );
  }
  if (criteria.country !== undefined) {
    query = query.where(
      'country', 
      criteria.country === null ? 'is' : '=', 
      criteria.country
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

  return await query
    .selectAll()
    .execute();
}
