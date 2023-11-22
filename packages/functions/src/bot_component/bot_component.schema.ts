import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { BotSchema } from "../bot/bot.schema";
import { ComponentSchema } from "../component/component.schema";

const BotComponentSchemaDef = {
    install_date: Joi.date(),
    component_serial: Joi.string().max(255),
};

export const BotComponentSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotComponentSchemaDef,
    bot_id: Joi.number(),
    component_id: Joi.number(),
    // uncoment to enable eager loading
    //bot: BotSchema,
    component: ComponentSchema,
});

export const CreateBotComponentSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotComponentSchemaDef
}).keys({
    // overwrite keys for required attributes
    install_date: Joi.date().required(),
    bot_id: Joi.number().required(),
    component_id: Joi.number().required(),
});;

export const UpdateBotComponentSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotComponentSchemaDef
});

export const SearchBotComponentSchema = Joi.object({
    id: Joi.number(),
    ...BotComponentSchemaDef
});

export const BotComponentResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: BotComponentSchema
});

export const BotComponentArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(BotComponentSchema)
});