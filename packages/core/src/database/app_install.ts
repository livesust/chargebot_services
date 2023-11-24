import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface AppInstallTable extends AuditedEntity {
  app_version: string;
  platform: string;
  os_version: string;
  description?: string;
  user_id: number;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type AppInstall = Selectable<AppInstallTable>
export type NewAppInstall = Insertable<AppInstallTable>
export type AppInstallUpdate = Updateable<AppInstallTable>
