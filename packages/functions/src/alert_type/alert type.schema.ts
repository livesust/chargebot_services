import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const AlertTypeSchemaDef = {
    name: Joi.string().max(255),
    description: Joi.string(),
    color_code: Joi.string().max(100),
    send_push: Joi.boolean(),
    alert_text: Joi.string().max(255),
    alert_link: Joi.string(),
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
    color_code: Joi.string().max(100).required(),
    alert_text: Joi.string().max(255).required(),
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