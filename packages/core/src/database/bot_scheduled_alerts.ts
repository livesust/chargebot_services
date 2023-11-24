import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";

export interface BotScheduledAlertsTable extends AuditedEntity {
  alert_status?: boolean;
  settings?: object;
  scheduled_alert_id: number;
  user_id: number;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotScheduledAlerts = Selectable<BotScheduledAlertsTable>
export type NewBotScheduledAlerts = Insertable<BotScheduledAlertsTable>
export type BotScheduledAlertsUpdate = Updateable<BotScheduledAlertsTable>
