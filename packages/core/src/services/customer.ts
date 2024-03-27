export * as Customer from "./customer";
import db from '../database';
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
        .set(customer)
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
  entity: Customer | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('customer')
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
        .deleteFrom('customer')
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Customer[]> {
    return db
        .selectFrom("customer")
        .selectAll()
        .where('deleted_by', 'is', null)
        .execute();
}

export async function lazyGet(id: number): Promise<Customer | undefined> {
    return db
        .selectFrom("customer")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<Customer | undefined> {
    return db
        .selectFrom("customer")
        .selectAll()
        .where('id', '=', id)
        .where('deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<Customer>): Promise<Customer[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<Customer>): Promise<Customer[]> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Customer>): Promise<Customer | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<Customer>): Promise<Customer | undefined> {
  const query = buildCriteriaQuery(criteria);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

function buildCriteriaQuery(criteria: Partial<Customer>) {
  let query = db.selectFrom('customer').where('deleted_by', 'is', null);

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

  return query;
}
