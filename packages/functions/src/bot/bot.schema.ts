import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const BotSchemaDef = {
    bot_uuid: Joi.string(),
    initials: Joi.string().max(2),
    name: Joi.string().max(255),
    pin_color: Joi.string().max(100),
};

export const BotSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotSchemaDef,
});

export const CreateBotSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotSchemaDef
}).keys({
    // overwrite keys for required attributes
    bot_uuid: Joi.string().required(),
    initials: Joi.string().max(2).required(),
    name: Joi.string().max(255).required(),
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