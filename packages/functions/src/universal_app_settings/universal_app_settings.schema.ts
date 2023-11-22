import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { AppSettingsTypeSchema } from "../app_settings_type/app_settings_type.schema";

const UniversalAppSettingsSchemaDef = {
    setting_value: Joi.string().max(255),
};

export const UniversalAppSettingsSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UniversalAppSettingsSchemaDef,
    app_settings_type_id: Joi.number(),
    app_settings_type: AppSettingsTypeSchema,
});

export const CreateUniversalAppSettingsSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...UniversalAppSettingsSchemaDef
}).keys({
    // overwrite keys for required attributes
    setting_value: Joi.string().max(255).required(),
    app_settings_type_id: Joi.number().required(),
});;

export const UpdateUniversalAppSettingsSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...UniversalAppSettingsSchemaDef
});

export const SearchUniversalAppSettingsSchema = Joi.object({
    id: Joi.number(),
    ...UniversalAppSettingsSchemaDef
});

export const UniversalAppSettingsResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: UniversalAppSettingsSchema
});

export const UniversalAppSettingsArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(UniversalAppSettingsSchema)
});