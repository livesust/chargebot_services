import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface UserEmailTable extends AuditedEntity {
  email_address: string;
  verified?: boolean;
  primary?: boolean;
  user_id: number;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type UserEmail = Selectable<UserEmailTable>
export type NewUserEmail = Insertable<UserEmailTable>
export type UserEmailUpdate = Updateable<UserEmailTable>
