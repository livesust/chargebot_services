import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const ScheduledAlertSchemaDef = {
    name: Joi.string().max(255),
    description: Joi.string().allow(null, ''),
    config_settings: Joi.object().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...ScheduledAlertSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...ScheduledAlertSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(255).required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...ScheduledAlertSchemaDef,
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...ScheduledAlertSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});