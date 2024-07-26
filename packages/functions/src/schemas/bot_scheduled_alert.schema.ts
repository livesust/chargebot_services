import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as BotSchema } from "./bot.schema";

import { EntitySchema as ScheduledAlertSchema } from "./scheduled_alert.schema";

const BotScheduledAlertSchemaDef = {
    alert_status: Joi.boolean().allow(null),
    settings: Joi.object().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotScheduledAlertSchemaDef,
    bot_id: Joi.number(),
    scheduled_alert_id: Joi.number(),
    
    bot: BotSchema,
    
    scheduled_alert: ScheduledAlertSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotScheduledAlertSchemaDef
}).keys({
    // overwrite keys for required attributes
    bot_id: Joi.number().required(),
    scheduled_alert_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotScheduledAlertSchemaDef,
    bot_id: Joi.number(),
    scheduled_alert_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    bot_id: Joi.number(),
    scheduled_alert_id: Joi.number(),
    ...BotScheduledAlertSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});