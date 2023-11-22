import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";


export interface UniversalAppSettingsTable extends AuditedEntity {
  setting_value: string;
  app_settings_type_id: number;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type UniversalAppSettings = Selectable<UniversalAppSettingsTable>
export type NewUniversalAppSettings = Insertable<UniversalAppSettingsTable>
export type UniversalAppSettingsUpdate = Updateable<UniversalAppSettingsTable>
