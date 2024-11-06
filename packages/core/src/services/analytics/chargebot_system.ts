export * as ChargebotSystem from "./chargebot_system";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotSystem, NewChargebotSystem, SystemVariables } from "../../timescale/chargebot_system";

export async function updateConnectionStatus(connectedStatus: NewChargebotSystem): Promise<ChargebotSystem> {
  // @ts-expect-error ignore type
  return db
    .insertInto("chargebot_system")
    .values({
      ...connectedStatus,
    })
    .returningAll()
    .executeTakeFirst();
}

export async function getSystemStatus(bot_uuid: string): Promise<ChargebotSystem[]> {
  return db
    .selectFrom("chargebot_system")
    // @ts-expect-error ignore type
    .select(() => [
      'device_id',
      'variable',
      sql`last(coalesce (value_int, value_long, value_float, value_double), "timestamp") as value`,
      sql`last(value_boolean, "timestamp") as value_boolean`,
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', [
      SystemVariables.CONNECTED,
      SystemVariables.CPU,
      SystemVariables.MEMORY,
      SystemVariables.DISK,
      SystemVariables.TEMPERATURE,
      SystemVariables.UPTIME_MINUTES,
      SystemVariables.UNVERVOLTAGE
    ])
    .groupBy(['device_id', 'variable'])
    .execute();
}

export async function getSystemStatuses(bot_uuids: string[]): Promise<ChargebotSystem[]> {
  return db
    .selectFrom("chargebot_system")
    // @ts-expect-error ignore type
    .select(() => [
      'device_id',
      'variable',
      sql`last(coalesce (value_int, value_long, value_float, value_double), "timestamp") as value`,
      sql`last(value_boolean, "timestamp") as value_boolean`,
    ])
    .where('device_id', 'in', bot_uuids)
    .where('variable', 'in', [
      SystemVariables.CONNECTED,
      SystemVariables.CPU,
      SystemVariables.MEMORY,
      SystemVariables.DISK,
      SystemVariables.TEMPERATURE,
      SystemVariables.UPTIME_MINUTES,
      SystemVariables.UNVERVOLTAGE
    ])
    .groupBy(['device_id', 'variable'])
    .execute();
}

export async function getSystemSummary(): Promise<{
  offline_bots: number;
  min_cpu: number;
  max_cpu: number;
  avg_cpu: number;
  min_memory: number;
  max_memory: number;
  avg_memory: number;
  min_disk: number;
  max_disk: number;
  avg_disk: number;
  min_temperature: number;
  max_temperature: number;
  avg_temperature: number;
  min_uptime: number;
  max_uptime: number;
  avg_uptime: number;
}> {
  // @ts-expect-error ignore type
  return db
    .with(
      'latest_values',
      (db) => db
        .selectFrom('chargebot_system')
        .distinctOn(['device_id', 'variable'])
        // @ts-expect-error implicit any
        .select(() => [
          sql`device_id`,
          'variable',
          sql`
          case 
              when variable = 'connected' then value_boolean::int
              else coalesce(value_int::float, value_long::float, value_float, value_double)
          end as value
          `,
        ])
        .where('variable', 'in', [
          SystemVariables.CONNECTED,
          SystemVariables.CPU,
          SystemVariables.MEMORY,
          SystemVariables.DISK,
          SystemVariables.TEMPERATURE,
          SystemVariables.UPTIME_MINUTES
        ])
        .orderBy('device_id', 'asc')
        .orderBy('variable', 'asc')
        .orderBy('timestamp', 'desc')
    )
    .selectFrom("latest_values")
    .select(() => [
      sql`sum(case when variable = 'connected' and value = 0 then 1 end) as offline_bots`,
      sql`max(case when variable = 'cpu_percent' then value end) as max_cpu`,
      sql`min(case when variable = 'cpu_percent' then value end) as min_cpu`,
      sql`avg(case when variable = 'cpu_percent' then value end) as avg_cpu`,
      sql`max(case when variable = 'memory_info' then value end) as max_memory`,
      sql`min(case when variable = 'memory_info' then value end) as min_memory`,
      sql`avg(case when variable = 'memory_info' then value end) as avg_memory`,
      sql`max(case when variable = 'disk' then value end) as max_disk`,
      sql`min(case when variable = 'disk' then value end) as min_disk`,
      sql`avg(case when variable = 'disk' then value end) as avg_disk`,
      sql`max(case when variable = 'temperature' then value end) as max_temperature`,
      sql`min(case when variable = 'temperature' then value end) as min_temperature`,
      sql`avg(case when variable = 'temperature' then value end) as avg_temperature`,
      sql`max(case when variable = 'uptime_minutes' then value end) as max_uptime`,
      sql`min(case when variable = 'uptime_minutes' then value end) as min_uptime`,
      sql`avg(case when variable = 'uptime_minutes' then value end) as avg_uptime`,
    ])
    .executeTakeFirst();
}
