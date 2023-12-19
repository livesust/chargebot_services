import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const StateMasterSchemaDef = {
    name: Joi.string().max(100),
    abbreviation: Joi.string().max(45),
    country: Joi.string().max(255),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...StateMasterSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...StateMasterSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(100).required(),
    abbreviation: Joi.string().max(45).required(),
    country: Joi.string().max(255).required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...StateMasterSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...StateMasterSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});