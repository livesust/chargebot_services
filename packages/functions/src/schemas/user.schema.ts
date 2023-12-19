import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const UserSchemaDef = {
    first_name: Joi.string().max(255),
    last_name: Joi.string().max(255),
    title: Joi.string().max(255).allow(null),
    photo: Joi.string().max(255).allow(null),
    invite_status: Joi.number().allow(null),
    super_admin: Joi.boolean().allow(null),
    user_id: Joi.string().max(255),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UserSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...UserSchemaDef
}).keys({
    // overwrite keys for required attributes
    first_name: Joi.string().max(255).required(),
    last_name: Joi.string().max(255).required(),
    user_id: Joi.string().max(255).required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...UserSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...UserSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});