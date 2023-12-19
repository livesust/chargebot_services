import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const UniversalAppSettingsSchemaDef = {
    setting_value: Joi.string().max(255),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UniversalAppSettingsSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...UniversalAppSettingsSchemaDef
}).keys({
    // overwrite keys for required attributes
    setting_value: Joi.string().max(255).required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...UniversalAppSettingsSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
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