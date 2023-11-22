import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { UserSchema } from "../user/user.schema";
import { RoleSchema } from "../role/role.schema";

const UserRoleSchemaDef = {
    all_bots: Joi.boolean(),
};

export const UserRoleSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UserRoleSchemaDef,
    user_id: Joi.number(),
    role_id: Joi.number(),
    // uncoment to enable eager loading
    //user: UserSchema,
    role: RoleSchema,
});

export const CreateUserRoleSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...UserRoleSchemaDef
}).keys({
    // overwrite keys for required attributes
    user_id: Joi.number().required(),
    role_id: Joi.number().required(),
});;

export const UpdateUserRoleSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...UserRoleSchemaDef
});

export const SearchUserRoleSchema = Joi.object({
    id: Joi.number(),
    ...UserRoleSchemaDef
});

export const UserRoleResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: UserRoleSchema
});

export const UserRoleArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(UserRoleSchema)
});