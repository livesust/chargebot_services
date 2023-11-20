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

export async function create(company: NewCompany): Promise<Company | undefined> {
    return await db
        .insertInto('company')
        .values(company)
        .returningAll()
        .executeTakeFirst();
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

export async function hard_remove(id: number): Promise<{ id: number | undefined } | undefined> {
    return await db
        .deleteFrom('company')
        .where('id', '=', id)
        .returning(['id'])
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
        // uncoment to enable eager loading
        //.select((eb) => withCustomer(eb))
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Company>) {
  let query = db.selectFrom('company').where('deleted_by', 'is', null)

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

  return await query.selectAll().execute();
}
