import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { Bot } from "./bot";
import { ScheduledAlert } from "./scheduled_alert";

export interface BotScheduledAlertTable extends AuditedEntity {
  alert_status?: boolean;
  settings?: object;
  bot_id: number;
  scheduled_alert_id: number;
  bot?: Bot;
  scheduled_alert?: ScheduledAlert;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotScheduledAlert = Selectable<BotScheduledAlertTable>
export type NewBotScheduledAlert = Insertable<BotScheduledAlertTable>
export type BotScheduledAlertUpdate = Updateable<BotScheduledAlertTable>
