import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { EntitySchema as UserSchema } from "./user.schema";
import { EntitySchema as RoleSchema } from "./role.schema";

const UserRoleSchemaDef = {
    all_bots: Joi.boolean(),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UserRoleSchemaDef,
    user_id: Joi.number(),
    role_id: Joi.number(),
    // uncoment to enable eager loading
    //user: UserSchema,
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
    ...UserRoleSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
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