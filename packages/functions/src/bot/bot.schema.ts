import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { BotVersionSchema } from "../bot_version/bot_version.schema";

const BotSchemaDef = {
    bot_uuid: Joi.string(),
    initials: Joi.string().max(2),
    name: Joi.string().max(255),
    pin_color: Joi.string().max(100),
};

export const BotSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotSchemaDef,
    bot_version_id: Joi.number(),
    bot_version: BotVersionSchema,
});

export const CreateBotSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotSchemaDef
}).keys({
    // overwrite keys for required attributes
    bot_uuid: Joi.string().required(),
    initials: Joi.string().max(2).required(),
    name: Joi.string().max(255).required(),
    bot_version_id: Joi.number().required(),
});;

export const UpdateBotSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotSchemaDef
});

export const SearchBotSchema = Joi.object({
    id: Joi.number(),
    ...BotSchemaDef
});

export const BotResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: BotSchema
});

export const BotArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(BotSchema)
});