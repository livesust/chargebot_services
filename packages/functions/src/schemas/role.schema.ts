import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const RoleSchemaDef = {
    role: Joi.string().max(255),
    description: Joi.string().allow(null, ''),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...RoleSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...RoleSchemaDef
}).keys({
    // overwrite keys for required attributes
    role: Joi.string().max(255).required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...RoleSchemaDef,
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...RoleSchemaDef
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