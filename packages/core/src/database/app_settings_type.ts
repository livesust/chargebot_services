import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface AppSettingsTypeTable extends AuditedEntity {
  setting_name?: string;
  description?: string;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type AppSettingsType = Selectable<AppSettingsTypeTable>
export type NewAppSettingsType = Insertable<AppSettingsTypeTable>
export type AppSettingsTypeUpdate = Updateable<AppSettingsTypeTable>
