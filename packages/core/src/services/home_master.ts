export * as HomeMaster from "./home_master";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { HomeMaster, HomeMasterUpdate, NewHomeMaster } from "../database/home_master";

export function withStateMaster(eb: ExpressionBuilder<Database, 'home_master'>) {
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

export async function update(id: number, home_master: HomeMasterUpdate): Promise<{
  entity: HomeMaster | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('home_master')
        .set({
            ...home_master,
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
  entity: HomeMaster | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('home_master')
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
        .deleteFrom('home_master')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<HomeMaster[]> {
    return db
        .selectFrom("home_master")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function paginate(page: number, pageSize: number): Promise<HomeMaster[]> {
    return db
        .selectFrom("home_master")
        .selectAll()
        .where('deleted_by', 'is', null)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .execute();
}

export async function lazyGet(id: number): Promise<HomeMaster | undefined> {
    return db
        .selectFrom("home_master")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<HomeMaster | undefined> {
    return db
        .selectFrom("home_master")
        .selectAll()
        .select((eb) => withStateMaster(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCompany(company_id: number): Promise<HomeMaster | undefined> {
    return db
        .selectFrom("home_master")
        .innerJoin("company", "company.home_master_id", "home_master.id")
        .where('company.id', '=', company_id)
        .where('home_master.deleted_by', 'is', null)
        .where('company.deleted_by', 'is', null)
        .selectAll('home_master')
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<HomeMaster>): Promise<HomeMaster[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withStateMaster(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<HomeMaster>): Promise<HomeMaster[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<HomeMaster>): Promise<HomeMaster | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withStateMaster(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<HomeMaster>): Promise<HomeMaster | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
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
  if (criteria.place_id !== undefined) {
    query = query.where(
      'place_id', 
      criteria.place_id === null ? 'is' : '=', 
      criteria.place_id
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
