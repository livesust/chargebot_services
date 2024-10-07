export * as Company from "./company";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { Company, CompanyUpdate, NewCompany } from "../database/company";
import { withStateMaster } from "./home_master";

export function withCustomer(eb: ExpressionBuilder<Database, 'company'>) {
    return jsonObjectFrom(
      eb.selectFrom('customer')
        .selectAll()
        .whereRef('customer.id', '=', 'company.customer_id')
        .where('customer.deleted_by', 'is', null)
    ).as('customer')
}

export function withHomeMaster(eb: ExpressionBuilder<Database, 'company'>) {
    return jsonObjectFrom(
      eb.selectFrom('home_master')
        .selectAll()
        .select((eb) => withStateMaster(eb))
        .whereRef('home_master.id', '=', 'company.home_master_id')
        .where('home_master.deleted_by', 'is', null)
    ).as('home_master')
}


export async function create(company: NewCompany): Promise<{
  entity: Company | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('company')
        .values({
            ...company,
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

export async function update(id: number, company: CompanyUpdate): Promise<{
  entity: Company | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('company')
        .set({
            ...company,
        })
        .where('company.id', '=', id)
        .where('company.deleted_by', 'is', null)
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
  entity: Company | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('company')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('company.id', '=', id)
        .where('company.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<Company>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('company')
        .where('company.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Company[]> {
    return db
        .selectFrom("company")
        .selectAll()
        .select((eb) => withCustomer(eb))
        .select((eb) => withHomeMaster(eb))
        .where('company.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<Company>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("company").where('company.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('company.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<Company>): Promise<Company[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("company").where('company.deleted_by', 'is', null);
  return query
      .selectAll("company")
      .select((eb) => withCustomer(eb))
      .select((eb) => withHomeMaster(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<Company | undefined> {
    return db
        .selectFrom("company")
        .selectAll()
        .where('company.id', '=', id)
        .where('company.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<Company | undefined> {
    return db
        .selectFrom("company")
        .selectAll()
        .select((eb) => withCustomer(eb))
        .select((eb) => withHomeMaster(eb))
        .where('company.id', '=', id)
        .where('company.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Company>): Promise<Company[]> {
  return buildSelectQuery(criteria)
    .selectAll("company")
    .select((eb) => withCustomer(eb))
    .select((eb) => withHomeMaster(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<Company>): Promise<Company[]> {
  return buildSelectQuery(criteria)
    .selectAll("company")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Company>): Promise<Company | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("company")
    .select((eb) => withCustomer(eb))
    .select((eb) => withHomeMaster(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<Company>): Promise<Company | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("company")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<Company>) {
  let query = db.selectFrom('company');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<Company>) {
  let query = db.updateTable('company');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<Company>): any {
  query = query.where('company.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.name !== undefined) {
    query = query.where(
      'company.name', 
      criteria.name === null ? 'is' : 'like', 
      criteria.name === null ? null : `%${ criteria.name }%`
    );
  }
  if (criteria.emergency_phone !== undefined) {
    query = query.where(
      'company.emergency_phone', 
      criteria.emergency_phone === null ? 'is' : 'like', 
      criteria.emergency_phone === null ? null : `%${ criteria.emergency_phone }%`
    );
  }
  if (criteria.emergency_email !== undefined) {
    query = query.where(
      'company.emergency_email', 
      criteria.emergency_email === null ? 'is' : 'like', 
      criteria.emergency_email === null ? null : `%${ criteria.emergency_email }%`
    );
  }

  if (criteria.customer_id) {
    query = query.where('company.customer_id', '=', criteria.customer_id);
  }
  if (criteria.home_master_id) {
    query = query.where('company.home_master_id', '=', criteria.home_master_id);
  }

  if (criteria.created_by) {
    query = query.where('company.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'company.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
