export * as ChargebotPDU from "./chargebot_pdu";
import { sql } from "kysely";
import db from '../../api';
import { ChargebotPDU, PDUVariable, PDU_OUTLET_IDS } from "../../api/chargebot_pdu";

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
  // @ts-expect-error not overloads match
  const status: {timestamp: Date, status: string} | undefined = await db
    .selectFrom("chargebot_pdu")
    .select([
      'timestamp',
      sql`(case when value_int = 0 then 'OFF' else 'ON' end) as status`
    ])
    .where('device_id', '=', bot_uuid)
    .where('variable', '=', translateOutletId(outlet_id))
    .orderBy('timestamp', 'desc')
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



export function translateOutletId(outlet_id: number): PDUVariable {
  if (!outlet_id) {
    return PDUVariable.OUTLET_1_STATE;
  }

  return PDU_OUTLET_IDS[outlet_id-1];
}
