export * as ChargebotSystem from "./chargebot_system";
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
  // @ts-expect-error ignore type
  return db
    .selectFrom("chargebot_system")
    .distinctOn("variable")
    .select(({ fn }) => [
      'device_id',
      'timestamp',
      'variable',
      fn.coalesce(
        'value_int',
        'value_long',
        'value_float',
        'value_double',
      ).as('value'),
      'value_boolean'
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', [
      SystemVariables.CONNECTED,
      SystemVariables.CPU,
      SystemVariables.MEMORY,
      SystemVariables.DISK,
      SystemVariables.TEMPERATURE,
      SystemVariables.UPTIME_MINUTES
    ])
    .orderBy('variable', 'desc')
    .orderBy('timestamp', 'desc')
    .execute();
}

export async function getSystemStatuses(bot_uuids: string[]): Promise<ChargebotSystem[]> {
  // @ts-expect-error ignore type
  return db
    .selectFrom("chargebot_system")
    .distinctOn(["device_id", "variable"])
    .select(({ fn }) => [
      'device_id',
      'timestamp',
      'variable',
      fn.coalesce(
        'value_int',
        'value_long',
        'value_float',
        'value_double',
      ).as('value'),
      'value_boolean'
    ])
    .where('device_id', 'in', bot_uuids)
    .where('variable', 'in', [
      SystemVariables.CONNECTED,
      SystemVariables.CPU,
      SystemVariables.MEMORY,
      SystemVariables.DISK,
      SystemVariables.TEMPERATURE,
      SystemVariables.UPTIME_MINUTES
    ])
    .orderBy('device_id', 'desc')
    .orderBy('variable', 'desc')
    .orderBy('timestamp', 'desc')
    .execute();
}
