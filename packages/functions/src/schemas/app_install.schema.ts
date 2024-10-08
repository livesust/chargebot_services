import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as UserSchema } from "./user.schema";

const AppInstallSchemaDef = {
    app_version: Joi.string().max(255),
    platform: Joi.string().max(100),
    app_platform_id: Joi.string(),
    os_version: Joi.string().max(100),
    push_token: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    active: Joi.boolean().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...AppInstallSchemaDef,
    user_id: Joi.number().allow(null),
    user: UserSchema.allow(null),    
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...AppInstallSchemaDef
}).keys({
    // overwrite keys for required attributes
    app_version: Joi.string().max(255).required(),
    platform: Joi.string().max(100).required(),
    app_platform_id: Joi.string().required(),
    os_version: Joi.string().max(100).required(),
    user_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...AppInstallSchemaDef,
    user_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    user_id: Joi.number(),
    ...AppInstallSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});

export const PaginateResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.object({
      records: Joi.array().items(EntitySchema),
      count: Joi.number()
    })
});