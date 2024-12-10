export * as ChargebotBotStatus from "./chargebot_bot_status";
import { sql } from "kysely";
import db from '../../timescale';
import { SystemVariables } from "../../timescale/chargebot_system";
import { BatteryVariables } from "../../timescale/chargebot_battery";
import { InverterVariable } from "../../timescale/chargebot_inverter";
import { PDUVariable } from "../../timescale/chargebot_pdu";
import { TemperatureVariables } from "../../timescale/chargebot_temperature";
import { FanVariables } from "../../timescale/chargebot_fan";
import { ErrorCode } from "../../timescale/chargebot_error";
import { BotComponents } from "../../timescale/chargebot_bot_status";

export async function getHardwareStatus(bot_uuid: string): Promise<{
  component: string,
  timestamp: Date,
  connected: boolean
}[]> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom('chargebot_bot_status')
    // @ts-expect-error not overloads match
    .select(() => [
      'component',
      sql`max(timestamp) as timestamp`,
      sql`
      CASE
        WHEN component = 'gps' and max(timestamp) < NOW() - INTERVAL '60 minutes' THEN false
        WHEN component != 'gps' and max(timestamp) < NOW() - INTERVAL '30 minutes' THEN false
        ELSE true
      END as connected`
    ])
    .where('device_id', '=', bot_uuid)
    .groupBy('component')
    .execute();
}

export async function getPiStatus(bot_uuid: string): Promise<{
  variable: string,
  timestamp: Date,
  value: number
}[]> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom('chargebot_bot_status')
    // @ts-expect-error not overloads match
    .select(() => [
      'variable',
      sql`max(timestamp) as timestamp`,
      sql`last(coalesce(value_boolean::int, value_int, value_long, value_float, value_double), "timestamp") as value`
    ])
    .where('device_id', '=', bot_uuid)
    .where('component', '=', BotComponents.SYSTEM)
    .groupBy('variable')
    .execute();
}


export async function getBotStatus(bot_uuid: string): Promise<{
  component: string,
  variable: string,
  timestamp: Date,
  value: number
}[]> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom('chargebot_bot_status')
    // @ts-expect-error not overloads match
    .select(() => [
      'component',
      'variable',
      'timestamp',
      sql`coalesce(value_boolean::int, value_int, value_long, value_float, value_double) as value`
    ])
    .where('device_id', '=', bot_uuid)
    .execute();
}