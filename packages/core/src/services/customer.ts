export * as Customer from "./customer";
import db from '../database';
import { Customer, CustomerUpdate, NewCustomer } from "../database/customer";


export async function create(customer: NewCustomer): Promise<Customer | undefined> {
    return await db
        .insertInto('customer')
        .values(customer)
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, customer: CustomerUpdate): Promise<Customer | undefined> {
    return await db
        .updateTable('customer')
        .set(customer)
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();
}

export async function remove(id: number, user_id: string): Promise<{ id: number | undefined } | undefined> {
    return await db
        .updateTable('customer')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .returning(['id'])
        .executeTakeFirst();
}

export async function hard_remove(id: number): Promise<{ id: number | undefined } | undefined> {
    return await db
        .deleteFrom('customer')
        .where('id', '=', id)
        .returning(['id'])
        .executeTakeFirst();
}

export async function list(): Promise<Customer[]> {
    return await db
        .selectFrom("customer")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function get(id: number): Promise<Customer | undefined> {
    return await db
        .selectFrom("customer")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Customer>) {
  let query = db.selectFrom('customer').where('deleted_by', 'is', null)

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
  if (criteria.email !== undefined) {
    query = query.where(
      'email', 
      criteria.email === null ? 'is' : '=', 
      criteria.email
    );
  }
  if (criteria.first_order_date) {
    query = query.where('first_order_date', '=', criteria.first_order_date);
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
