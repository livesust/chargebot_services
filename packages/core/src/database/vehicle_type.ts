import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface VehicleTypeTable extends AuditedEntity {
  type: string;
  description?: string;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type VehicleType = Selectable<VehicleTypeTable>
export type NewVehicleType = Insertable<VehicleTypeTable>
export type VehicleTypeUpdate = Updateable<VehicleTypeTable>
