import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { Bot } from "./bot";
import { Component } from "./component";

export interface BotComponentTable extends AuditedEntity {
  install_date: Date;
  component_serial?: string;
  bot_id: number;
  component_id: number;
  bot?: Bot;
  component?: Component;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotComponent = Selectable<BotComponentTable>
export type NewBotComponent = Insertable<BotComponentTable>
export type BotComponentUpdate = Updateable<BotComponentTable>
