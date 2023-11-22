import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { UserSchema } from "../user/user.schema";

const AppInstallSchemaDef = {
    app_version: Joi.string().max(255),
    platform: Joi.string().max(100),
    os_version: Joi.string().max(100),
    description: Joi.string(),
};

export const AppInstallSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...AppInstallSchemaDef,
    user_id: Joi.number(),
    user: UserSchema,
});

export const CreateAppInstallSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...AppInstallSchemaDef
}).keys({
    // overwrite keys for required attributes
    app_version: Joi.string().max(255).required(),
    platform: Joi.string().max(100).required(),
    os_version: Joi.string().max(100).required(),
    user_id: Joi.number().required(),
});;

export const UpdateAppInstallSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...AppInstallSchemaDef
});

export const SearchAppInstallSchema = Joi.object({
    id: Joi.number(),
    ...AppInstallSchemaDef
});

export const AppInstallResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: AppInstallSchema
});

export const AppInstallArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(AppInstallSchema)
});