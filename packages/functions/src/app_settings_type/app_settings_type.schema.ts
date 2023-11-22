import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const AppSettingsTypeSchemaDef = {
    setting_name: Joi.string().max(100),
    description: Joi.string(),
};

export const AppSettingsTypeSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...AppSettingsTypeSchemaDef,
});

export const CreateAppSettingsTypeSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...AppSettingsTypeSchemaDef
}).keys({
    // overwrite keys for required attributes
    setting_name: Joi.string().max(100).required(),
});;

export const UpdateAppSettingsTypeSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...AppSettingsTypeSchemaDef
});

export const SearchAppSettingsTypeSchema = Joi.object({
    id: Joi.number(),
    ...AppSettingsTypeSchemaDef
});

export const AppSettingsTypeResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: AppSettingsTypeSchema
});

export const AppSettingsTypeArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(AppSettingsTypeSchema)
});