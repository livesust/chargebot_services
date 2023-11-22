import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { AlertTypeSchema } from "../alert_type/alert_type.schema";
// uncoment to enable eager loading
//import { BotSchema } from "../bot/bot.schema";

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

export const BotAlertSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotAlertSchemaDef,
    alert_type_id: Joi.number(),
    bot_id: Joi.number(),
    alert_type: AlertTypeSchema,
    // uncoment to enable eager loading
    //bot: BotSchema,
});

export const CreateBotAlertSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotAlertSchemaDef
}).keys({
    // overwrite keys for required attributes
    alert_type_id: Joi.number().required(),
    bot_id: Joi.number().required(),
});;

export const UpdateBotAlertSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotAlertSchemaDef
});

export const SearchBotAlertSchema = Joi.object({
    id: Joi.number(),
    ...BotAlertSchemaDef
});

export const BotAlertResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: BotAlertSchema
});

export const BotAlertArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(BotAlertSchema)
});