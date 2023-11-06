import { AuditedEntity } from "./audited_entity";

export interface Bot extends AuditedEntity {
  bot_uuid: string;
  name: string;
  initials: string;
  pin_color: string;
}