import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { EntitySchema as AppSettingsTypeSchema } from "./app_settings_type.schema";

const UniversalAppSettingsSchemaDef = {
    setting_value: Joi.string().max(255),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UniversalAppSettingsSchemaDef,
    app_settings_type_id: Joi.number(),
    app_settings_type: AppSettingsTypeSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...UniversalAppSettingsSchemaDef
}).keys({
    // overwrite keys for required attributes
    setting_value: Joi.string().max(255).required(),
    app_settings_type_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...UniversalAppSettingsSchemaDef,
    app_settings_type_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    app_settings_type_id: Joi.number(),
    ...UniversalAppSettingsSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});