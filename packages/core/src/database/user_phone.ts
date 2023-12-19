import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface UserPhoneTable extends AuditedEntity {
  phone_number: string;
  send_text?: boolean;
  primary?: boolean;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type UserPhone = Selectable<UserPhoneTable>
export type NewUserPhone = Insertable<UserPhoneTable>
export type UserPhoneUpdate = Updateable<UserPhoneTable>
