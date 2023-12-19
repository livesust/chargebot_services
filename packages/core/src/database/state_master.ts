import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface StateMasterTable extends AuditedEntity {
  name: string;
  abbreviation: string;
  country: string;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type StateMaster = Selectable<StateMasterTable>
export type NewStateMaster = Insertable<StateMasterTable>
export type StateMasterUpdate = Updateable<StateMasterTable>
