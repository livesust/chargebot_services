import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { StateMaster } from "./state_master";

export interface HomeMasterTable extends AuditedEntity {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  zip_code?: string;
  latitude: number;
  longitude: number;
  state_master_id: number;
  state_master?: StateMaster;
  place_id?: string;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type HomeMaster = Selectable<HomeMasterTable>
export type NewHomeMaster = Insertable<HomeMasterTable>
export type HomeMasterUpdate = Updateable<HomeMasterTable>
