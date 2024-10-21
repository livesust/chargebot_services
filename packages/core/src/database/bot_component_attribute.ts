import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { Bot } from "./bot";
import { ComponentAttribute } from "./component_attribute";

export interface BotComponentAttributeTable extends AuditedEntity {
  value?: string;
  bot_id: number;
  component_attribute_id: number;
  bot?: Bot;
  component_attribute?: ComponentAttribute;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type BotComponentAttribute = Selectable<BotComponentAttributeTable>
export type NewBotComponentAttribute = Insertable<BotComponentAttributeTable>
export type BotComponentAttributeUpdate = Updateable<BotComponentAttributeTable>
