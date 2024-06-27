export * as ChargebotPDU from "./chargebot_pdu";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotPDU, PDUFirmwareState, PDUState, PDUVariable, PDU_OUTLET_IDS } from "../../timescale/chargebot_pdu";

export async function getPDUStatus(bot_uuid: string): Promise<ChargebotPDU[]> {

  const variables = [PDUVariable.STATE, PDUVariable.CURRENT];

  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_pdu")
    .select([
      'device_id',
      'variable',
      sql`last(coalesce (value_int, value_long, value_float, value_double), "timestamp") as value`,
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', 'in', variables)
    .groupBy(['device_id', 'variable'])
    .execute();
}

export async function getOutletStatus(bot_uuid: string, pdu_outlet_number: number): Promise<{timestamp: Date, status: string} | undefined> {
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
        .where('variable', '=', translatePduOutletNumber(pdu_outlet_number))
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

export function translatePduOutletNumber(pdu_outlet_number: number=0): PDUVariable {
  if (!pdu_outlet_number) {
    return PDUVariable.OUTLET_1_STATE;
  }

  return PDU_OUTLET_IDS[pdu_outlet_number-1];
}

export function translatePDUState(state: number): PDUState {
  if (state) {
    if (state == PDUFirmwareState.LIMITED_CHARGE_MODE || state == PDUFirmwareState.PROBING_OUTLETS || state == PDUFirmwareState.SHUTDOWN || state == PDUFirmwareState.ECO_MODE) {
      return PDUState.LIMITED;
    } else if (state == PDUFirmwareState.PRIORITY_CHARGE) {
      return PDUState.PRIORITY_CHARGE;
    } else if (state == PDUFirmwareState.HIGH_TEMP) {
      return PDUState.HIGH_TEMP;
    } else if (state == PDUFirmwareState.STARTUP) {
      return PDUState.STARTUP;
    }
  }
  return PDUState.NORMAL;
}
