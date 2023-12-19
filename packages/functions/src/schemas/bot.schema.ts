import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const BotSchemaDef = {
    bot_uuid: Joi.string(),
    initials: Joi.string().max(2),
    name: Joi.string().max(255),
    pin_color: Joi.string().max(100).allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotSchemaDef
}).keys({
    // overwrite keys for required attributes
    bot_uuid: Joi.string().required(),
    initials: Joi.string().max(2).required(),
    name: Joi.string().max(255).required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...BotSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});