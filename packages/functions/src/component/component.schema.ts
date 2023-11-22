import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const ComponentSchemaDef = {
    name: Joi.string().max(255),
    version: Joi.string().max(100),
    description: Joi.string(),
    specs: Joi.string(),
    location: Joi.string().max(255),
    notes: Joi.string(),
};

export const ComponentSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...ComponentSchemaDef,
});

export const CreateComponentSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...ComponentSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(255).required(),
});;

export const UpdateComponentSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...ComponentSchemaDef
});

export const SearchComponentSchema = Joi.object({
    id: Joi.number(),
    ...ComponentSchemaDef
});

export const ComponentResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: ComponentSchema
});

export const ComponentArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(ComponentSchema)
});