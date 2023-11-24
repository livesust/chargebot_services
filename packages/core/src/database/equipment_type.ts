import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface EquipmentTypeTable extends AuditedEntity {
  type: string;
  description?: string;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type EquipmentType = Selectable<EquipmentTypeTable>
export type NewEquipmentType = Insertable<EquipmentTypeTable>
export type EquipmentTypeUpdate = Updateable<EquipmentTypeTable>
