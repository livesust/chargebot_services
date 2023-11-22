import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";


export interface ScheduledAlertTable extends AuditedEntity {
  name: string;
  description?: string;
    alert_content?: string;
  }

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ScheduledAlert = Selectable<ScheduledAlertTable>
export type NewScheduledAlert = Insertable<ScheduledAlertTable>
export type ScheduledAlertUpdate = Updateable<ScheduledAlertTable>
