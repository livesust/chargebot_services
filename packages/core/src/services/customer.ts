export * as Customer from "./customer";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db from '../database';
import { UpdateResult } from "kysely";
import { Customer, CustomerUpdate, NewCustomer } from "../database/customer";


export async function create(customer: NewCustomer): Promise<{
  entity: Customer | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('customer')
        .values({
            ...customer,
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

export async function update(id: number, customer: CustomerUpdate): Promise<{
  entity: Customer | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('customer')
        .set({
            ...customer,
        })
        .where('customer.id', '=', id)
        .where('customer.deleted_by', 'is', null)
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
  entity: Customer | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('customer')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('customer.id', '=', id)
        .where('customer.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<Customer>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('customer')
        .where('customer.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Customer[]> {
    return db
        .selectFrom("customer")
        .selectAll()
        .where('customer.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<Customer>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("customer").where('customer.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('customer.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<Customer>): Promise<Customer[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("customer").where('customer.deleted_by', 'is', null);
  return query
      .selectAll("customer")
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<Customer | undefined> {
    return db
        .selectFrom("customer")
        .selectAll()
        .where('customer.id', '=', id)
        .where('customer.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<Customer | undefined> {
    return db
        .selectFrom("customer")
        .selectAll()
        .where('customer.id', '=', id)
        .where('customer.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Customer>): Promise<Customer[]> {
  return buildSelectQuery(criteria)
    .selectAll("customer")
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<Customer>): Promise<Customer[]> {
  return buildSelectQuery(criteria)
    .selectAll("customer")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Customer>): Promise<Customer | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("customer")
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<Customer>): Promise<Customer | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("customer")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<Customer>) {
  let query = db.selectFrom('customer');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<Customer>) {
  let query = db.updateTable('customer');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<Customer>): any {
  query = query.where('customer.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.name !== undefined) {
    query = query.where(
      'customer.name', 
      criteria.name === null ? 'is' : 'like', 
      criteria.name === null ? null : `%${ criteria.name }%`
    );
  }
  if (criteria.email !== undefined) {
    query = query.where(
      'customer.email', 
      criteria.email === null ? 'is' : 'like', 
      criteria.email === null ? null : `%${ criteria.email }%`
    );
  }
  if (criteria.first_order_date) {
    query = query.where('customer.first_order_date', '=', criteria.first_order_date);
  }


  if (criteria.created_by) {
    query = query.where('customer.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'customer.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
