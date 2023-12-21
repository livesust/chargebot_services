import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { EntitySchema as AlertTypeSchema } from "./alert_type.schema";
// uncoment to enable eager loading
//import { EntitySchema as BotSchema } from "./bot.schema";

const BotAlertSchemaDef = {
    message_displayed: Joi.string().allow(null),
    push_sent: Joi.boolean().allow(null),
    send_time: Joi.date().allow(null),
    display_time: Joi.date().allow(null),
    show: Joi.boolean().allow(null),
    dismissed: Joi.boolean().allow(null),
    active: Joi.boolean().allow(null),
    alert_count: Joi.number().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotAlertSchemaDef,
    alert_type_id: Joi.number(),
    bot_id: Joi.number(),
    alert_type: AlertTypeSchema,
    // uncoment to enable eager loading
    //bot: BotSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotAlertSchemaDef
}).keys({
    // overwrite keys for required attributes
    alert_type_id: Joi.number().required(),
    bot_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotAlertSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    alert_type_id: Joi.number(),
    bot_id: Joi.number(),
    ...BotAlertSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});