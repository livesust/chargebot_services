import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { EntitySchema as AlertTypeSchema } from "./alert_type.schema";
// uncoment to enable eager loading
//import { EntitySchema as BotSchema } from "./bot.schema";

const BotAlertSchemaDef = {
    message_displayed: Joi.string(),
    push_sent: Joi.boolean(),
    send_time: Joi.date(),
    display_time: Joi.date(),
    show: Joi.boolean(),
    dismissed: Joi.boolean(),
    active: Joi.boolean(),
    alert_count: Joi.number(),
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