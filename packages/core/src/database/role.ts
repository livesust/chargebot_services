import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";


export interface RoleTable extends AuditedEntity {
  role: string;
  description?: string;
  }

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type Role = Selectable<RoleTable>
export type NewRole = Insertable<RoleTable>
export type RoleUpdate = Updateable<RoleTable>
