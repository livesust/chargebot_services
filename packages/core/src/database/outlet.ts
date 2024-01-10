import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { OutletType } from "./outlet_type";
import { Bot } from "./bot";

export interface OutletTable extends AuditedEntity {
  pdu_outlet_number: number;
  notes?: string;
  outlet_type_id: number;
  bot_id: number;
  outlet_type?: OutletType;
  bot?: Bot;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type Outlet = Selectable<OutletTable>
export type NewOutlet = Insertable<OutletTable>
export type OutletUpdate = Updateable<OutletTable>
