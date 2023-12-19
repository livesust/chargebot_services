import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const AlertTypeSchemaDef = {
    name: Joi.string().max(255),
    description: Joi.string().allow(null),
    priority: Joi.string().max(255).allow(null),
    severity: Joi.string().max(255).allow(null),
    color_code: Joi.string().max(100),
    send_push: Joi.boolean().allow(null),
    alert_text: Joi.string().max(255),
    alert_link: Joi.string().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...AlertTypeSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...AlertTypeSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(255).required(),
    color_code: Joi.string().max(100).required(),
    alert_text: Joi.string().max(255).required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...AlertTypeSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...AlertTypeSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});