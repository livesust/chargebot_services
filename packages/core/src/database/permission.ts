import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";


export interface PermissionTable extends AuditedEntity {
  permission_name: string;
  description?: string;
  }

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type Permission = Selectable<PermissionTable>
export type NewPermission = Insertable<PermissionTable>
export type PermissionUpdate = Updateable<PermissionTable>
