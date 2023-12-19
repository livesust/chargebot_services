import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const AppInstallSchemaDef = {
    app_version: Joi.string().max(255),
    platform: Joi.string().max(100),
    os_version: Joi.string().max(100),
    description: Joi.string().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...AppInstallSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...AppInstallSchemaDef
}).keys({
    // overwrite keys for required attributes
    app_version: Joi.string().max(255).required(),
    platform: Joi.string().max(100).required(),
    os_version: Joi.string().max(100).required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...AppInstallSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...AppInstallSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});