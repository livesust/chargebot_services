import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { AppInstall } from "./app_install";
import { Permission } from "./permission";

export interface AppInstallPermissionsTable extends AuditedEntity {
  permission_status?: boolean;
  app_install_id: number;
  permission_id: number;
  app_install?: AppInstall;
  permission?: Permission;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type AppInstallPermissions = Selectable<AppInstallPermissionsTable>
export type NewAppInstallPermissions = Insertable<AppInstallPermissionsTable>
export type AppInstallPermissionsUpdate = Updateable<AppInstallPermissionsTable>
