import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { BotStatus } from "./bot_status";
import { BotModel } from "./bot_model";
import { Vehicle } from "./vehicle";
import { Company } from './company';

export interface BotTable extends AuditedEntity {
  bot_uuid: string;
  initials: string;
  name: string;
  notes?: string;
  pin_color?: string;
  attachments?: string[];
  bot_status_id?: number;
  bot_model_id?: number;
  vehicle_id?: number;
  bot_status?: BotStatus;
  bot_model?: BotModel;
  vehicle?: Vehicle;
  company?: Company;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type Bot = Selectable<BotTable>
export type NewBot = Insertable<BotTable>
export type BotUpdate = Updateable<BotTable>
