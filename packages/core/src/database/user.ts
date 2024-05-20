import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { Company } from "./company";



export enum UserInviteStatus {
  INVITED = 'INVITED',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED'
}

export interface UserTable extends AuditedEntity {
  first_name?: string;
  last_name?: string;
  title?: string;
  photo?: string;
  invite_status?: UserInviteStatus;
  super_admin?: boolean;
  onboarding?: boolean;
  privacy_terms_last_accepted?: Date;
  privacy_terms_version?: string;
  user_id: string;
  company_id: number;
  company?: Company;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>
