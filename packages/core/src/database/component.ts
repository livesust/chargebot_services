import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface ComponentTable extends AuditedEntity {
  name: string;
  version?: string;
  description?: string;
  specs?: string;
  location?: string;
  notes?: string;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type Component = Selectable<ComponentTable>
export type NewComponent = Insertable<ComponentTable>
export type ComponentUpdate = Updateable<ComponentTable>
