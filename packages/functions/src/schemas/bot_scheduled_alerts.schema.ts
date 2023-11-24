import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { EntitySchema as ScheduledAlertSchema } from "./scheduled_alert.schema";
// uncoment to enable eager loading
//import { EntitySchema as UserSchema } from "./user.schema";

const BotScheduledAlertsSchemaDef = {
    alert_status: Joi.boolean(),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotScheduledAlertsSchemaDef,
    scheduled_alert_id: Joi.number(),
    user_id: Joi.number(),
    scheduled_alert: ScheduledAlertSchema,
    // uncoment to enable eager loading
    //user: UserSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotScheduledAlertsSchemaDef
}).keys({
    // overwrite keys for required attributes
    scheduled_alert_id: Joi.number().required(),
    user_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotScheduledAlertsSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...BotScheduledAlertsSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});