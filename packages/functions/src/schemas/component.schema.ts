import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const ComponentSchemaDef = {
    name: Joi.string().max(255),
    version: Joi.string().max(100).allow(null),
    description: Joi.string().allow(null),
    specs: Joi.string().allow(null),
    location: Joi.string().max(255).allow(null),
    notes: Joi.string().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...ComponentSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...ComponentSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(255).required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...ComponentSchemaDef,
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...ComponentSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});