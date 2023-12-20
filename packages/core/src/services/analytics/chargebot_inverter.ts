export * as ChargebotInverter from "./chargebot_inverter";
import { sql } from "kysely";
import db from '../../api';
import { ChargebotInverter, InverterVariable } from "../../api/chargebot_inverter";

export async function getBatteryStatus(bot_uuid: string): Promise<string | undefined> {
  // @ts-expect-error not overloads match
  const batteryCurrent: ChargebotInverter | undefined = await db
    .selectFrom("chargebot_inverter")
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
    .where('variable', '=', InverterVariable.BATTERY_CURRENT)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();

  if (!batteryCurrent?.value) {
    return undefined;
  }

  const current = batteryCurrent.value as number;
  if (current < 0) {
    return 'DISCHARGING';
  } else if (current > 0) {
    return 'CHARGING';
  }

  return 'IDLE';
}

export async function getInverterStatus(bot_uuid: string): Promise<ChargebotInverter[]> {
  // @ts-expect-error not overloads match
  const status: ChargebotInverter[] = await db
    .selectFrom("chargebot_inverter")
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
        'value_int',
        'value_long',
        'value_float',
        'value_double'
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', [
      InverterVariable.BATTERY_LEVEL_SOC,
      InverterVariable.BATTERY_CURRENT,
      InverterVariable.BATTERY_VOLTAGE,
      InverterVariable.BATTERY_POWER,
      InverterVariable.BATTERY_CHARGE_DIFF,
      InverterVariable.BATTERY_DISCHARGE_DIFF,
      InverterVariable.SOLAR_POWER,
      InverterVariable.SOLAR_CHARGE_DIFF,
      InverterVariable.GRID_CURRENT,
      InverterVariable.GRID_CHARGE_DIFF,
      InverterVariable.ENERGY_USAGE
    ])
    .orderBy('timestamp', 'desc')
    .limit(1)
    .execute();

  return status;
}

export async function getEnergyTotalsToday(bot_uuid: string): Promise<ChargebotInverter[]> {
  // @ts-expect-error not overloads match
  const status: ChargebotInverter[] = await db
    .selectFrom("chargebot_inverter")
    .select(({ fn }) => [
      'variable',
      fn.sum(
        fn.coalesce(
          'value_int',
          'value_long',
          'value_float',
          'value_double'
        )
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('timestamp', '>', sql`date_trunc('day', current_date at time zone 'UTC')`)
    .where('variable', 'in', [
      InverterVariable.BATTERY_CHARGE_DIFF,
      InverterVariable.BATTERY_DISCHARGE_DIFF,
      InverterVariable.SOLAR_CHARGE_DIFF,
      InverterVariable.GRID_CHARGE_DIFF,
      InverterVariable.ENERGY_USAGE
    ])
    .groupBy('variable')
    .execute();

  return status;
}
