import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { AlertType } from "./alert_type";

export interface BotAlertTable extends AuditedEntity {
  message_displayed?: string;
  push_sent?: boolean;
  send_time?: Date;
  display_time?: Date;
  show?: boolean;
  dismissed?: boolean;
  active?: boolean;
  alert_count?: number;
  alert_type_id: number;
  bot_id: number;
  alert_type?: AlertType;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotAlert = Selectable<BotAlertTable>
export type NewBotAlert = Insertable<BotAlertTable>
export type BotAlertUpdate = Updateable<BotAlertTable>
