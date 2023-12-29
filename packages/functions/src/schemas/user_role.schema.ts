import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { EntitySchema as UserSchema } from "./user.schema";
import { EntitySchema as RoleSchema } from "./role.schema";

const UserRoleSchemaDef = {
    all_bots: Joi.boolean().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UserRoleSchemaDef,
    user_id: Joi.number(),
    role_id: Joi.number(),
    user: UserSchema,
    role: RoleSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...UserRoleSchemaDef
}).keys({
    // overwrite keys for required attributes
    user_id: Joi.number().required(),
    role_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...UserRoleSchemaDef,
    user_id: Joi.number(),
    role_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    user_id: Joi.number(),
    role_id: Joi.number(),
    ...UserRoleSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});