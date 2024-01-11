import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { VehicleType } from "./vehicle_type";

export interface VehicleTable extends AuditedEntity {
  name: string;
  license_plate: string;
  notes?: string;
  vehicle_type_id: number;
  vehicle_type?: VehicleType;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type Vehicle = Selectable<VehicleTable>
export type NewVehicle = Insertable<VehicleTable>
export type VehicleUpdate = Updateable<VehicleTable>
