export * as Company from "./company";
import db, { Database } from '../database';
import { ExpressionBuilder } from "kysely";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { Company, CompanyUpdate, NewCompany } from "../database/company";

function withCustomer(eb: ExpressionBuilder<Database, 'company'>) {
    return jsonObjectFrom(
      eb.selectFrom('customer')
        .selectAll()
        .whereRef('customer.id', '=', 'company.customer_id')
    ).as('customer')
}

function withHomeMaster(eb: ExpressionBuilder<Database, 'company'>) {
    return jsonObjectFrom(
      eb.selectFrom('home_master')
        .selectAll()
        .whereRef('home_master.id', '=', 'company.home_master_id')
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

export async function update(id: number, company: CompanyUpdate): Promise<Company | undefined> {
    return await db
        .updateTable('company')
        .set(company)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('company')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<void> {
    await db
        .deleteFrom('company')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Company[]> {
    return await db
        .selectFrom("company")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<Company | undefined> {
    return await db
        .selectFrom("company")
        .selectAll()
        .select((eb) => withCustomer(eb))
        .select((eb) => withHomeMaster(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Company>): Promise<Company[]> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withCustomer(eb))
    .select((eb) => withHomeMaster(eb))
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Company>): Promise<Company | undefined> {
  const query = buildCriteriaQuery(criteria);

  return await query
    .selectAll()
    .select((eb) => withCustomer(eb))
    .select((eb) => withHomeMaster(eb))
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<Company>) {
  let query = db.selectFrom('company').where('deleted_by', 'is', null);

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
  if (criteria.emergency_phone !== undefined) {
    query = query.where(
      'emergency_phone', 
      criteria.emergency_phone === null ? 'is' : '=', 
      criteria.emergency_phone
    );
  }
  if (criteria.emergency_email !== undefined) {
    query = query.where(
      'emergency_email', 
      criteria.emergency_email === null ? 'is' : '=', 
      criteria.emergency_email
    );
  }

  if (criteria.customer_id) {
    query = query.where('customer_id', '=', criteria.customer_id);
  }
  if (criteria.home_master_id) {
    query = query.where('home_master_id', '=', criteria.home_master_id);
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
