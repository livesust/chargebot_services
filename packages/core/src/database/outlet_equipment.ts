import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";


export interface OutletEquipmentTable extends AuditedEntity {
  notes?: string;
    equipment_id: number;
  outlet_id: number;
  user_id: number;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type OutletEquipment = Selectable<OutletEquipmentTable>
export type NewOutletEquipment = Insertable<OutletEquipmentTable>
export type OutletEquipmentUpdate = Updateable<OutletEquipmentTable>
