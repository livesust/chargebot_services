import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { BotSchema } from "../bot/bot.schema";

const BotChargingSettingsSchemaDef = {
    all_day: Joi.boolean(),
    start_time: Joi.date(),
    end_time: Joi.date(),
};

export const BotChargingSettingsSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotChargingSettingsSchemaDef,
    bot_id: Joi.number(),
    // uncoment to enable eager loading
    //bot: BotSchema,
});

export const CreateBotChargingSettingsSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotChargingSettingsSchemaDef
}).keys({
    // overwrite keys for required attributes
    start_time: Joi.date().required(),
    end_time: Joi.date().required(),
    bot_id: Joi.number().required(),
});;

export const UpdateBotChargingSettingsSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotChargingSettingsSchemaDef
});

export const SearchBotChargingSettingsSchema = Joi.object({
    id: Joi.number(),
    ...BotChargingSettingsSchemaDef
});

export const BotChargingSettingsResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: BotChargingSettingsSchema
});

export const BotChargingSettingsArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(BotChargingSettingsSchema)
});