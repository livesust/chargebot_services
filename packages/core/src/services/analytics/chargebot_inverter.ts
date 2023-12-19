export * as ChargebotInverter from "./chargebot_inverter";
import { sql } from "kysely";
import db from '../../api';
import { ChargebotInverter, InverterVariables } from "../../api/chargebot_inverter";

export async function getBatteryStatus(bot_uuid: string): Promise<string | undefined> {
  // @ts-expect-error not overloads match
  const battery: ChargebotInverter | undefined = await db
    .selectFrom("chargebot_inverter")
    // @ts-expect-error any
    .select(({ fn }) => [
      'device_id',
      'device_version',
      'timestamp',
      'timezone',
      'variable',
      'address',
      'unit',
      'data_type',
      fn.coalesce(
        sql`value_int::text`,
        sql`value_long::text`,
        sql`value_float::text`,
        sql`value_double::text`
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', InverterVariables.BATTERY_CURRENT)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();

  if (!battery?.value) {
    return undefined;
  }

  const current = battery.value as number;
  if (current < 0) {
    return 'DISCHARGING';
  } else if (current > 0) {
    return 'CHARGING';
  }

  return 'IDLE';
}

export async function getInverterStatus(bot_uuid: string): Promise<ChargebotInverter | undefined> {
  // @ts-expect-error not overloads match
  const battery: ChargebotInverter | undefined = await db
    .selectFrom("chargebot_inverter")
    // @ts-expect-error any
    .select(({ fn }) => [
      'device_id',
      'device_version',
      'timestamp',
      'timezone',
      'variable',
      'address',
      'unit',
      'data_type',
      fn.coalesce(
        sql`value_int::text`,
        sql`value_long::text`,
        sql`value_float::text`,
        sql`value_double::text`
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', [
      InverterVariables.BATTERY_LEVEL_SOC,
      InverterVariables.BATTERY_CURRENT,
      InverterVariables.BATTERY_VOLTAGE,
      InverterVariables.BATTERY_POWER,
      InverterVariables.BATTERY_CHARGE_DIFF,
      InverterVariables.BATTERY_DISCHARGE_DIFF,
      InverterVariables.SOLAR_CHARGE,
      InverterVariables.GRID_CHARGE,
      InverterVariables.ENERGY_USAGE
    ])
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();

  return battery;
}