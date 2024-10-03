export * as Bot from "./bot";
import db, { Database } from '../database';
import { ExpressionBuilder, UpdateResult } from "kysely";
import { BusinessError } from "../errors/business_error";
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { Bot, BotUpdate, NewBot } from "../database/bot";

export function withBotVersion(eb: ExpressionBuilder<Database, 'bot'>) {
    return jsonObjectFrom(
      eb.selectFrom('bot_version')
        .selectAll()
        .whereRef('bot_version.id', '=', 'bot.bot_version_id')
        .where('bot_version.deleted_by', 'is', null)
    ).as('bot_version')
}

export function withVehicle(eb: ExpressionBuilder<Database, 'bot'>) {
    return jsonObjectFrom(
      eb.selectFrom('vehicle')
        .selectAll()
        .whereRef('vehicle.id', '=', 'bot.vehicle_id')
        .where('vehicle.deleted_by', 'is', null)
    ).as('vehicle')
}

export function withCompany(eb: ExpressionBuilder<Database, 'bot'>) {
    return jsonObjectFrom(
      eb.selectFrom('company')
        .innerJoin('bot_company', 'bot_company.bot_id', 'bot.id')
        .selectAll('company')
        .whereRef('company.id', '=', 'bot_company.company_id')
        .where('bot_company.deleted_by', 'is', null)
        .where('company.deleted_by', 'is', null)
    ).as('company')
}

async function canAssignEquipment(bot_id: number | null, vehicle_id: number): Promise<boolean> {
  const count: { value: number; } | undefined = await db
    .selectFrom('bot')
    .select(({ fn }) => [
      fn.count<number>('bot.id').as('value'),
    ])
    .where('bot.id', '!=', bot_id)
    .where('bot.vehicle_id', '=', vehicle_id)
    .where('bot.deleted_by', 'is', null)
    .executeTakeFirst();
  return (count && count.value == 0) ?? false;
}


export async function create(bot: NewBot): Promise<{
  entity: Bot | undefined,
  event: unknown
} | undefined> {
    const exists = await db
        .selectFrom('bot')
        .select(['bot.id'])
        .where((eb) => eb.or([
            eb('bot.bot_uuid', '=', bot.bot_uuid),
        ]))
        .where('bot.deleted_by', 'is', null)
        .executeTakeFirst();

    if (exists) {
        throw Error('Entity already exists with unique values');
    }

    if (bot.vehicle_id && !(await canAssignEquipment(null, bot.vehicle_id))) {
      throw new BusinessError('Vehicle assigned to another bot');
    }

    const created = await db
        .insertInto('bot')
        .values({
            ...bot,
        })
        .returningAll()
        .executeTakeFirst();
    
    if (!created) {
      return undefined;
    }

    return {
      entity: created,
      // event to dispatch on EventBus on creation
      event: created
    };
}

export async function update(id: number, bot: BotUpdate): Promise<{
  entity: Bot | undefined,
  event: unknown
} | undefined> {

    if (bot.vehicle_id && !(await canAssignEquipment(id, bot.vehicle_id))) {
      throw new BusinessError('Vehicle assigned to another bot');
    }

    const updated = await db
        .updateTable('bot')
        .set({
            ...bot,
        })
        .where('bot.id', '=', id)
        .where('bot.deleted_by', 'is', null)
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
  entity: Bot | undefined,
  event: unknown
} | undefined> {
    const deleted = await db
        .updateTable('bot')
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .where('bot.id', '=', id)
        .where('bot.deleted_by', 'is', null)
        .returningAll()
        .executeTakeFirst();

  if (!deleted) {
    return undefined;
  }

  return {
    entity: deleted,
    event: deleted
  };
}

export async function removeByCriteria(criteria: Partial<Bot>, user_id: string): Promise<UpdateResult[]> {
    return buildUpdateQuery(criteria)
        .set({ deleted_date: new Date(), deleted_by: user_id })
        .execute();
}

export async function hard_remove(id: number): Promise<void> {
    db
        .deleteFrom('bot')
        .where('bot.id', '=', id)
        .executeTakeFirst();
}

export async function list(): Promise<Bot[]> {
    return db
        .selectFrom("bot")
        .selectAll()
        .select((eb) => withBotVersion(eb))
        .select((eb) => withVehicle(eb))
        .select((eb) => withCompany(eb))
        .where('bot.deleted_by', 'is', null)
        .execute();
}

export async function count(criteria?: Partial<Bot>): Promise<number> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot").where('bot.deleted_by', 'is', null);
  const count: { value: number; } | undefined = await query
        .select(({ fn }) => [
          fn.count<number>('bot.id').as('value'),
        ])
        .executeTakeFirst();
  return count?.value ?? 0;
}

export async function paginate(page: number, pageSize: number, criteria?: Partial<Bot>): Promise<Bot[]> {
  const query = criteria ? buildSelectQuery(criteria) : db.selectFrom("bot").where('bot.deleted_by', 'is', null);
  return query
      .selectAll("bot")
      .select((eb) => withBotVersion(eb))
      .select((eb) => withVehicle(eb))
      .select((eb) => withCompany(eb))
      .limit(pageSize)
      .offset(page * pageSize)
      .execute();
}

export async function lazyGet(id: number): Promise<Bot | undefined> {
    return db
        .selectFrom("bot")
        .selectAll()
        .where('bot.id', '=', id)
        .where('bot.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function get(id: number): Promise<Bot | undefined> {
    return db
        .selectFrom("bot")
        .selectAll()
        .select((eb) => withBotVersion(eb))
        .select((eb) => withVehicle(eb))
        .select((eb) => withCompany(eb))
        .where('bot.id', '=', id)
        .where('bot.deleted_by', 'is', null)
        .executeTakeFirst();
}

export async function findBotsByUser(user_id: string): Promise<Bot[]> {
  return await db
    .selectFrom('bot')
    .innerJoin('bot_user', 'bot_user.bot_id', 'bot.id')
    .innerJoin('user', 'user.id', 'bot_user.user_id')
    .where('user.user_id', '=', user_id)
    .where('bot.deleted_by', 'is', null)
    .where('bot_user.deleted_by', 'is', null)
    .selectAll('bot')
    .execute();
}

export async function findByCompany(company_id: number): Promise<Bot[]> {
  return db
      .selectFrom("bot")
      .innerJoin('bot_company', 'bot_company.bot_id', 'bot.id')
      .where('bot_company.company_id', '=', company_id)
      .where('bot_company.deleted_by', 'is', null)
      .where('bot.deleted_by', 'is', null)
      .selectAll('bot')
      .execute()
}

export async function findByCriteria(criteria: Partial<Bot>): Promise<Bot[]> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withBotVersion(eb))
    .select((eb) => withVehicle(eb))
    .select((eb) => withCompany(eb))
    .execute();
}

export async function lazyFindByCriteria(criteria: Partial<Bot>): Promise<Bot[]> {
  const query = buildSelectQuery(criteria, true);

  return query
    .selectAll()
    .execute();
}

export async function findOneByCriteria(criteria: Partial<Bot>): Promise<Bot | undefined> {
  const query = buildSelectQuery(criteria);

  return query
    .selectAll()
    .select((eb) => withBotVersion(eb))
    .select((eb) => withVehicle(eb))
    .select((eb) => withCompany(eb))
    .limit(1)
    .executeTakeFirst();
}

export async function lazyFindOneByCriteria(criteria: Partial<Bot>): Promise<Bot | undefined> {
  const query = buildSelectQuery(criteria, true);

  return query
    .selectAll()
    .limit(1)
    .executeTakeFirst();
}

function buildSelectQuery(criteria: Partial<Bot>, lazy = false) {
  let query = db.selectFrom('bot');
  query = getCriteriaQuery(query, criteria, lazy);
  return query;
}

function buildUpdateQuery(criteria: Partial<Bot>) {
  let query = db.updateTable('bot');
  query = getCriteriaQuery(query, criteria, true);
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCriteriaQuery(query: any, criteria: Partial<Bot>, lazy = false): any {
  query = query.where('bot.deleted_by', 'is', null);

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }

  if (criteria.bot_uuid !== undefined) {
    query = query.where(
      'bot.bot_uuid', 
      criteria.bot_uuid === null ? 'is' : 'like', 
      criteria.bot_uuid === null ? null : `%${criteria.bot_uuid}%`
    );
  }
  if (criteria.initials !== undefined) {
    query = query.where(
      'bot.initials', 
      criteria.initials === null ? 'is' : 'like', 
      criteria.initials === null ? null : `%${criteria.initials}%`
    );
  }
  if (criteria.name !== undefined) {
    query = query.where(
      'bot.name', 
      criteria.name === null ? 'is' : 'like', 
      criteria.name === null ? null : `%${criteria.name}%`
    );
  }
  if (criteria.pin_color !== undefined) {
    query = query.where(
      'bot.pin_color', 
      criteria.pin_color === null ? 'is' : 'like',
      criteria.pin_color === null ? null : `%${criteria.pin_color}%`
    );
  }
  if (Object.keys(criteria).some(k => k === "assigned")) {
    const assigned = Reflect.get(criteria, "assigned") as string;
    query = query.leftJoin('bot_company', 'bot_company.bot_id', 'bot.id');
    if (assigned === 'assigned') {
      query = query.where('bot_company.id', 'is not', null)
        .where('bot_company.deleted_by', 'is', null);
    } else if (assigned === 'pending') {
      query = query.where('bot_company.id', 'is', null);
    }
  }
  if (!lazy) {
    if (criteria.company) {
      query = query.leftJoin('bot_company', 'bot_company.bot_id', 'bot.id')
        .leftJoin('company', 'bot_company.company_id', 'company.id')
        .where('bot_company.deleted_by', 'is', null)
        .where('company.deleted_by', 'is', null);
      for (const attribute of Object.keys(criteria.company)) {
        const value = Reflect.get(criteria.company, attribute);
        query = query.where(`company.${attribute}`,
            value === null ? 'is' : 'like',
            value === null ? null : `%${value}%`
        );
      }
    }
  }

  if (criteria.bot_version_id) {
    query = query.where('bot.bot_version_id', '=', criteria.bot_version_id);
  }

  if (criteria.vehicle_id) {
    query = query.where('bot.vehicle_id', '=', criteria.vehicle_id);
  }

  if (criteria.created_by) {
    query = query.where('bot.created_by', '=', criteria.created_by);
  }

  if (criteria.modified_by !== undefined) {
    query = query.where(
      'bot.modified_by', 
      criteria.modified_by === null ? 'is' : '=', 
      criteria.modified_by
    );
  }

  return query;
}
