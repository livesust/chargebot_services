import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";


export interface OutletTypeTable extends AuditedEntity {
  type: string;
  outlet_amps?: number;
    outlet_volts?: number;
    connector?: string;
    description?: string;
  }

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type OutletType = Selectable<OutletTypeTable>
export type NewOutletType = Insertable<OutletTypeTable>
export type OutletTypeUpdate = Updateable<OutletTypeTable>
