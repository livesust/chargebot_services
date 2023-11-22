import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export enum AlertPriority {
  LOW = "LOW"
  MEDIUM = "MEDIUM"
  HIGH = "HIGH"
}
export enum AlertSeverity {
  MINOR = "MINOR"
  MODERATE = "MODERATE"
  CRITICAL = "CRITICAL"
}

export interface AlertTypeTable extends AuditedEntity {
  name: string;
  description?: string;
    priority?: AlertPriority;
    severity?: AlertSeverity;
    color_code: string;
  send_push?: boolean;
    alert_text: string;
  alert_link?: string;
  }

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type AlertType = Selectable<AlertTypeTable>
export type NewAlertType = Insertable<AlertTypeTable>
export type AlertTypeUpdate = Updateable<AlertTypeTable>
