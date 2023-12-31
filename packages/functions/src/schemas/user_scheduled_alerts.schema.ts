import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { EntitySchema as ScheduledAlertSchema } from "./scheduled_alert.schema";
import { EntitySchema as UserSchema } from "./user.schema";

const UserScheduledAlertsSchemaDef = {
    alert_status: Joi.boolean().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UserScheduledAlertsSchemaDef,
    scheduled_alert_id: Joi.number(),
    user_id: Joi.number(),
    scheduled_alert: ScheduledAlertSchema,
    user: UserSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...UserScheduledAlertsSchemaDef
}).keys({
    // overwrite keys for required attributes
    scheduled_alert_id: Joi.number().required(),
    user_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...UserScheduledAlertsSchemaDef,
    scheduled_alert_id: Joi.number(),
    user_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    scheduled_alert_id: Joi.number(),
    user_id: Joi.number(),
    ...UserScheduledAlertsSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});