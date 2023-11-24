import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface UserRoleTable extends AuditedEntity {
  all_bots?: boolean;
  user_id: number;
  role_id: number;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type UserRole = Selectable<UserRoleTable>
export type NewUserRole = Insertable<UserRoleTable>
export type UserRoleUpdate = Updateable<UserRoleTable>
