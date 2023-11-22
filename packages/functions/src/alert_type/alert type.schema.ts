import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const AlertTypeSchemaDef = {
    name: Joi.string().max(255),
    description: Joi.string(),
};

export const AlertTypeSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...AlertTypeSchemaDef,
});

export const CreateAlertTypeSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...AlertTypeSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(255).required(),
});;

export const UpdateAlertTypeSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...AlertTypeSchemaDef
});

export const SearchAlertTypeSchema = Joi.object({
    id: Joi.number(),
    ...AlertTypeSchemaDef
});

export const AlertTypeResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: AlertTypeSchema
});

export const AlertTypeArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(AlertTypeSchema)
});