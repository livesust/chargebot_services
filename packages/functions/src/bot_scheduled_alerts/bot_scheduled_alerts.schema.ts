import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { ScheduledAlertSchema } from "../scheduled_alert/scheduled_alert.schema";
// uncoment to enable eager loading
//import { UserSchema } from "../user/user.schema";

const BotScheduledAlertsSchemaDef = {
    alert_status: Joi.boolean(),
    settings: Joi.string(),
};

export const BotScheduledAlertsSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotScheduledAlertsSchemaDef,
    scheduled_alert_id: Joi.number(),
    user_id: Joi.number(),
    scheduled_alert: ScheduledAlertSchema,
    // uncoment to enable eager loading
    //user: UserSchema,
});

export const CreateBotScheduledAlertsSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotScheduledAlertsSchemaDef
}).keys({
    // overwrite keys for required attributes
    scheduled_alert_id: Joi.number().required(),
    user_id: Joi.number().required(),
});;

export const UpdateBotScheduledAlertsSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotScheduledAlertsSchemaDef
});

export const SearchBotScheduledAlertsSchema = Joi.object({
    id: Joi.number(),
    ...BotScheduledAlertsSchemaDef
});

export const BotScheduledAlertsResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: BotScheduledAlertsSchema
});

export const BotScheduledAlertsArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(BotScheduledAlertsSchema)
});