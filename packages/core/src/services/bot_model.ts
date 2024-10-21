export * as BotModel from "./bot_model";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";
import db from '../database';
import { UpdateResult } from "kysely";
import { BotModel, BotModelUpdate, NewBotModel } from "../database/bot_model";


export async function create(bot_model: NewBotModel): Promise<{
  entity: BotModel | undefined,
  event: unknown
} | undefined> {
    const created = await db
        .insertInto('bot_model')
        .values({
            ...bot_model,
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

export async function update(id: number, bot_model: BotModelUpdate): Promise<{
  entity: BotModel | undefined,
  event: unknown
} | undefined> {
    const updated = await db
        .updateTable('bot_model')
        .set({
            ...bot_model,
        })
        .where('bot_model.id', '=', id)
        .where('bot_model.deleted_by', 'is', null)
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
  entity: BotModel | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot_model')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot_model.id', '=', id)
        .where('bot_model.deleted_by', 'is', null)
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

export async function removeByCriteria(criteria: Partial<BotModel>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot_model')
        .where('bot_model.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<BotModel[]> {
    return db
        .selectFrom("bot_model")
        .selectAll()
        .where('bot_model.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<BotModel>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_model").where('bot_model.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot_model.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, sort: OrderByDirection, criteria?: Partial<BotModel>): Promise<BotModel[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot_model").where('bot_model.deleted_by', 'is', null);
  return query
      .selectAll("bot_model")
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy('created_date', sort)
      .execute();
}

export async function lazyGet(id: number): Promise<BotModel | undefined> {
    return db
        .selectFrom("bot_model")
        .selectAll()
        .where('bot_model.id', '=', id)
        .where('bot_model.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<BotModel | undefined> {
    return db
        .selectFrom("bot_model")
        .selectAll()
        .where('bot_model.id', '=', id)
        .where('bot_model.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findByCriteria(criteria: Partial<BotModel>): Promise<BotModel[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_model")
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<BotModel>): Promise<BotModel[]> {
  return buildSelectQuery(criteria)
    .selectAll("bot_model")
    .execute();
}

export async function findOneByCriteria(criteria: Partial<BotModel>): Promise<BotModel | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_model")
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<BotModel>): Promise<BotModel | undefined> {
  return buildSelectQuery(criteria)
    .selectAll("bot_model")
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<BotModel>) {
  let query = db.selectFrom('bot_model');
  query = getCriteriaQuery(query, criteria);
  return query;
}

function buildUpdateQuery(criteria: Partial<BotModel>) {
  let query = db.updateTable('bot_model');
  query = getCriteriaQuery(query, criteria);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<BotModel>): any {
  query = query.where('bot_model.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.name !== undefined) {
    query = query.where(
      'bot_model.name', 
      criteria.name === null ? 'is' : 'like', 
      criteria.name === null ? null : `%${ criteria.name }%`
    );
  }
  if (criteria.version !== undefined) {
    query = query.where(
      'bot_model.version', 
      criteria.version === null ? 'is' : 'like', 
      criteria.version === null ? null : `%${ criteria.version }%`
    );
  }
  if (criteria.release_date) {
    query = query.where('bot_model.release_date', '=', criteria.release_date);
  }


  if (criteria.created_by) {
    query = query.where('bot_model.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot_model.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
