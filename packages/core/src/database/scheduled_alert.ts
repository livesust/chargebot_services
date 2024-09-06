import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface ScheduledAlertTable extends AuditedEntity {
  name: string;
  description?: string;
  config_settings?: object;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ScheduledAlert = Selectable<ScheduledAlertTable>
export type NewScheduledAlert = Insertable<ScheduledAlertTable>
export type ScheduledAlertUpdate = Updateable<ScheduledAlertTable>

export enum ScheduledAlertName {
  NOT_PLUGGED_IN = "scheduled_alert.not_plugged_in.name",
  BATTERY_LOW = "scheduled_alert.battery_low.name",
  ARRIVE_HOME = "scheduled_alert.arrive_home.name",
  LEAVE_HOME = "scheduled_alert.leave_home.name",
  LONG_STOP = "scheduled_alert.long_stop.name",
  DAILY_USE = "scheduled_alert.daily_use.name",
  NOTHING_CHARGING = "scheduled_alert.nothing_charging.name"
}
