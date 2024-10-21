import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { Component } from "./component";

export interface ComponentAttributeTable extends AuditedEntity {
  name: string;
  type?: string;
  component_id: number;
  component?: Component;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ComponentAttribute = Selectable<ComponentAttributeTable>
export type NewComponentAttribute = Insertable<ComponentAttributeTable>
export type ComponentAttributeUpdate = Updateable<ComponentAttributeTable>
