import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { EquipmentType } from "./equipment_type";

export interface EquipmentTable extends AuditedEntity {
  name: string;
  brand?: string;
  description?: string;
  voltage?: number;
  max_charging_amps?: number;
  equipment_type_id: number;
  customer_id: number;
  equipment_type?: EquipmentType;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type Equipment = Selectable<EquipmentTable>
export type NewEquipment = Insertable<EquipmentTable>
export type EquipmentUpdate = Updateable<EquipmentTable>
