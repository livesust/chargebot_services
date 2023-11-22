import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const BotVersionSchemaDef = {
    version_number: Joi.string().max(255),
    version_name: Joi.string().max(255),
    notes: Joi.string(),
    active_date: Joi.date(),
};

export const BotVersionSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotVersionSchemaDef,
});

export const CreateBotVersionSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotVersionSchemaDef
}).keys({
    // overwrite keys for required attributes
    version_number: Joi.string().max(255).required(),
    version_name: Joi.string().max(255).required(),
});;

export const UpdateBotVersionSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotVersionSchemaDef
});

export const SearchBotVersionSchema = Joi.object({
    id: Joi.number(),
    ...BotVersionSchemaDef
});

export const BotVersionResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: BotVersionSchema
});

export const BotVersionArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(BotVersionSchema)
});