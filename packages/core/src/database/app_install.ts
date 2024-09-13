import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { User } from "./user";

export interface AppInstallTable extends AuditedEntity {
  app_version: string;
  platform: string;
  app_platform_id: string;
  os_version: string;
  push_token?: string;
  description?: string;
  active?: boolean;
  user_id: number;
  user?: User;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type AppInstall = Selectable<AppInstallTable>
export type NewAppInstall = Insertable<AppInstallTable>
export type AppInstallUpdate = Updateable<AppInstallTable>
