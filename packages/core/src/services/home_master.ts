export * as HomeMaster from "./home_master";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { HomeMaster, HomeMasterUpdate, NewHomeMaster } from "../database/home_master";

function withStateMaster(eb: ExpressionBuilder<Database, 'home_master'>) {
    return jsonObjectFrom(
      eb.selectFrom('state_master')
        .selectAll()
        .whereRef('state_master.id', '=', 'home_master.state_master_id')
    ).as('state_master')
}


export async function create(home_master: NewHomeMaster): Promise<{
  entity: HomeMaster | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('home_master')
        .values({
            ...home_master,
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

export async function update(id: number, home_master: HomeMasterUpdate): Promise<HomeMaster | undefined> {
    return await db
        .updateTable('home_master')
        .set(home_master)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('home_master')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('home_master')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<HomeMaster[]> {
    return await db
        .selectFrom("home_master")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<HomeMaster | undefined> {
    return await db
        .selectFrom("home_master")
        .selectAll()
        .select((eb) => withStateMaster(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<HomeMaster>): Promise<HomeMaster[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withStateMaster(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<HomeMaster>): Promise<HomeMaster | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withStateMaster(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<HomeMaster>) {
  let query = db.selectFrom('home_master').where('deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.address_line_1 !== undefined) {
    query = query.where(
      'address_line_1', 
      criteria.address_line_1 === null ? 'is' : '=', 
      criteria.address_line_1
    );
  }
  if (criteria.address_line_2 !== undefined) {
    query = query.where(
      'address_line_2', 
      criteria.address_line_2 === null ? 'is' : '=', 
      criteria.address_line_2
    );
  }
  if (criteria.city !== undefined) {
    query = query.where(
      'city', 
      criteria.city === null ? 'is' : '=', 
      criteria.city
    );
  }
  if (criteria.zip_code !== undefined) {
    query = query.where(
      'zip_code', 
      criteria.zip_code === null ? 'is' : '=', 
      criteria.zip_code
    );
  }
  if (criteria.latitude) {
    query = query.where('latitude', '=', criteria.latitude);
  }
  if (criteria.longitude) {
    query = query.where('longitude', '=', criteria.longitude);
  }

  if (criteria.state_master_id) {
    query = query.where('state_master_id', '=', criteria.state_master_id);
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
