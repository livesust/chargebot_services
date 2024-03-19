export * as ChargebotPDU from "./chargebot_pdu";
import { sql } from "kysely";
import db from '../../api';
import { ChargebotPDU, PDUState, PDUVariable, PDU_OUTLET_IDS } from "../../api/chargebot_pdu";

export async function getPDUStatus(bot_uuid: string): Promise<ChargebotPDU[] | undefined> {
  // @ts-expect-error not overloads match
  const status: ChargebotPDU[] | undefined = await db
    .selectFrom("chargebot_pdu")
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
        sql`value_double::text`,
        sql`value_string::text`
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', [
      PDUVariable.STATE,
      PDUVariable.CURRENT,
      PDUVariable.OUTLET_PRIORITY,
      PDUVariable.OUTLET_1_STATE,
      PDUVariable.OUTLET_2_STATE,
      PDUVariable.OUTLET_3_STATE,
      PDUVariable.OUTLET_4_STATE,
      PDUVariable.OUTLET_5_STATE,
      PDUVariable.OUTLET_6_STATE,
      PDUVariable.OUTLET_7_STATE,
      PDUVariable.OUTLET_8_STATE,
    ])
    .orderBy('timestamp', 'desc')
    .limit(1)
    .execute();

  return status;
}

export async function getPDUCurrent(bot_uuid: string): Promise<number | undefined> {
  // @ts-expect-error not overloads match
  const pduCurrent: ChargebotPDU | undefined = await db
    .selectFrom("chargebot_pdu")
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
        sql`value_double::text`,
        sql`value_string::text`
      ).as('value'),
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', PDUVariable.CURRENT)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();

  return pduCurrent?.value ? pduCurrent.value as number : undefined;
}

export async function getOutletStatus(bot_uuid: string, outlet_id: number): Promise<{timestamp: Date, status: string} | undefined> {
  // Returns the current status of an outlet and since when is in that status
  /*
  WITH status_groups AS (
      SELECT
          "timestamp",
          (case value_int when 0 then 'OFF' when 1 then 'ON' when 2 then 'LIMITED' when 3 then 'OFF SCHEDULE' else 'UNKNOWN' end) as status,
          ROW_NUMBER() OVER (ORDER BY timestamp DESC) - 
          ROW_NUMBER() OVER (PARTITION BY value_int ORDER BY "timestamp" DESC) AS block
      FROM
          chargebot_pdu
      where device_id = 'dev_device_33db2037-35b7-4d57-9844-9e08d99de3d1'
      and variable = 'outlet_state_0'
  )
  SELECT
      "timestamp",
      status
  FROM
      status_groups
  where block = 0
  ORDER BY
      timestamp ASC
  LIMIT 1;
  */
  // @ts-expect-error not overloads match
  const status: {timestamp: Date, status: string} | undefined = await db
    .with(
      'status_groups',
      (db) => db
        .selectFrom('chargebot_pdu')
        // @ts-expect-error ignore overload not mapping
        .select([
          'timestamp',
          sql`(case value_int when 0 then 'OFF' when 1 then 'ON' when 2 then 'LIMITED' when 3 then 'OFF_SCHEDULE' else 'UNKNOWN' end) as status`,
          sql`
            ROW_NUMBER() OVER (ORDER BY timestamp DESC) -
            ROW_NUMBER() OVER (PARTITION BY value_int ORDER BY "timestamp" DESC) AS block
          `
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', '=', translateOutletId(outlet_id))
    )
    .selectFrom('status_groups')
    .select(['timestamp', 'status'])
    .where('block', '=', 0)
    .orderBy('timestamp', 'asc')
    .limit(1)
    .executeTakeFirst();

  return status;
}

export async function getOutletPriorityCharging(bot_uuid: string): Promise<{timestamp: Date, outlet_id: number} | undefined> {
  // @ts-expect-error not overloads match
  const status: {timestamp: Date, outlet_id: number} | undefined = await db
    .selectFrom("chargebot_pdu")
    .select([
      'timestamp',
      sql`value_int as outlet_id`
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', PDUVariable.OUTLET_PRIORITY)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();

  return status;
}

export function translateOutletId(outlet_id: number=0): PDUVariable {
  if (!outlet_id) {
    return PDUVariable.OUTLET_1_STATE;
  }

  return PDU_OUTLET_IDS[outlet_id-1];
}

export function translatePDUState(state: number=1): PDUState {
  if (state in [4, 5]) return PDUState.LIMITED;
  if (state == 6) return PDUState.PRIORITY_CHARGE;
  if (state <= 7) return PDUState.HIGH_TEMP;
  return PDUState.NORMAL
}
