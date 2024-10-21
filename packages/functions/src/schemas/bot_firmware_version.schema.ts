import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const BotFirmwareVersionSchemaDef = {
    version_number: Joi.string().max(255),
    version_name: Joi.string().max(255),
    notes: Joi.string().allow(null, ''),
    active_date: Joi.date().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotFirmwareVersionSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotFirmwareVersionSchemaDef
}).keys({
    // overwrite keys for required attributes
    version_number: Joi.string().max(255).required(),
    version_name: Joi.string().max(255).required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotFirmwareVersionSchemaDef,
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...BotFirmwareVersionSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});

export const PaginateResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.object({
      records: Joi.array().items(EntitySchema),
      count: Joi.number()
    })
});