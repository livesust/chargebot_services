import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const ScheduledAlertSchemaDef = {
    name: Joi.string().max(255),
    description: Joi.string(),
    alert_content: Joi.string(),
};

export const ScheduledAlertSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...ScheduledAlertSchemaDef,
});

export const CreateScheduledAlertSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...ScheduledAlertSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(255).required(),
});;

export const UpdateScheduledAlertSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...ScheduledAlertSchemaDef
});

export const SearchScheduledAlertSchema = Joi.object({
    id: Joi.number(),
    ...ScheduledAlertSchemaDef
});

export const ScheduledAlertResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: ScheduledAlertSchema
});

export const ScheduledAlertArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(ScheduledAlertSchema)
});