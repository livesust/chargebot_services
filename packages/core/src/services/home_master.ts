export * as HomeMaster from "./home_master";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { HomeMaster, HomeMasterUpdate, NewHomeMaster } from "../database/home_master";

export function withStateMaster(eb: ExpressionBuilder<Database, 'home_master'>) {
    return jsonObjectFrom(
      eb.selectFrom('state_master')
        .selectAll()
        .whereRef('state_master.id', '=', 'home_master.state_master_id')
        .where('state_master.deleted_by', 'is', null)
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
        .where('home_master.id', '=', id)
        .where('home_master.deleted_by', 'is', null)
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
        .where('home_master.id', '=', id)
        .where('home_master.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<HomeMaster>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('home_master')
        .where('home_master.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<HomeMaster[]> {
    return db
        .selectFrom("home_master")
        .selectAll()
        .select((eb) => withStateMaster(eb))
        .where('home_master.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<HomeMaster>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("home_master").where('home_master.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('home_master.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<HomeMaster>): Promise<HomeMaster[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("home_master").where('home_master.deleted_by', 'is', null);
  return query
      .selectAll("home_master")
      .select((eb) => withStateMaster(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<HomeMaster | undefined> {
    return db
        .selectFrom("home_master")
        .selectAll()
        .where('home_master.id', '=', id)
        .where('home_master.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<HomeMaster | undefined> {
    return db
        .selectFrom("home_master")
        .selectAll()
        .select((eb) => withStateMaster(eb))
        .where('home_master.id', '=', id)
        .where('home_master.deleted_by', 'is', null)
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
  return buildSelectQuery(criteria)
    .selectAll("home_master")
    .select((eb) => withStateMaster(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<HomeMaster>): Promise<HomeMaster[]> {
  return buildSelectQuery(criteria)
    .selectAll("home_master")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<HomeMaster>): Promise<HomeMaster | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("home_master")
    .select((eb) => withStateMaster(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<HomeMaster>): Promise<HomeMaster | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("home_master")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<HomeMaster>) {
  let query = db.selectFrom('home_master');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<HomeMaster>) {
  let query = db.updateTable('home_master');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<HomeMaster>): any {
  query = query.where('home_master.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.address_line_1 !== undefined) {
    query = query.where(
      'home_master.address_line_1', 
      criteria.address_line_1 === null ? 'is' : 'like', 
      criteria.address_line_1 === null ? null : `%${ criteria.address_line_1 }%`
    );
  }
  if (criteria.address_line_2 !== undefined) {
    query = query.where(
      'home_master.address_line_2', 
      criteria.address_line_2 === null ? 'is' : 'like', 
      criteria.address_line_2 === null ? null : `%${ criteria.address_line_2 }%`
    );
  }
  if (criteria.city !== undefined) {
    query = query.where(
      'home_master.city', 
      criteria.city === null ? 'is' : 'like', 
      criteria.city === null ? null : `%${ criteria.city }%`
    );
  }
  if (criteria.zip_code !== undefined) {
    query = query.where(
      'home_master.zip_code', 
      criteria.zip_code === null ? 'is' : 'like', 
      criteria.zip_code === null ? null : `%${ criteria.zip_code }%`
    );
  }
  if (criteria.latitude) {
    query = query.where('home_master.latitude', '=', criteria.latitude);
  }
  if (criteria.longitude) {
    query = query.where('home_master.longitude', '=', criteria.longitude);
  }
  if (criteria.place_id !== undefined) {
    query = query.where(
      'home_master.place_id', 
      criteria.place_id === null ? 'is' : 'like', 
      criteria.place_id === null ? null : `%${ criteria.place_id }%`
    );
  }

  if (criteria.state_master_id) {
    query = query.where('home_master.state_master_id', '=', criteria.state_master_id);
  }

  if (criteria.created_by) {
    query = query.where('home_master.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'home_master.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
