import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { BotModel } from "./bot_model";
import { Component } from "./component";

export interface BotModelComponentTable extends AuditedEntity {
  assignment_date?: Date;
  bot_model_id: number;
  component_id: number;
  bot_model?: BotModel;
  component?: Component;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotModelComponent = Selectable<BotModelComponentTable>
export type NewBotModelComponent = Insertable<BotModelComponentTable>
export type BotModelComponentUpdate = Updateable<BotModelComponentTable>
