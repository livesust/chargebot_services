import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { ScheduledAlert } from "./scheduled_alert";
import { User } from "./user";

export interface UserScheduledAlertsTable extends AuditedEntity {
  alert_status?: boolean;
  settings?: object;
  scheduled_alert_id: number;
  user_id: number;
  scheduled_alert?: ScheduledAlert;
  user?: User;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type UserScheduledAlerts = Selectable<UserScheduledAlertsTable>
export type NewUserScheduledAlerts = Insertable<UserScheduledAlertsTable>
export type UserScheduledAlertsUpdate = Updateable<UserScheduledAlertsTable>
