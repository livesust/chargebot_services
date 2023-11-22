import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { UserSchema } from "../user/user.schema";

const UserEmailSchemaDef = {
    email_address: Joi.string(),
    verified: Joi.boolean(),
    primary: Joi.boolean(),
};

export const UserEmailSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UserEmailSchemaDef,
    user_id: Joi.number(),
    // uncoment to enable eager loading
    //user: UserSchema,
});

export const CreateUserEmailSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...UserEmailSchemaDef
}).keys({
    // overwrite keys for required attributes
    email_address: Joi.string().required(),
    user_id: Joi.number().required(),
});;

export const UpdateUserEmailSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...UserEmailSchemaDef
});

export const SearchUserEmailSchema = Joi.object({
    id: Joi.number(),
    ...UserEmailSchemaDef
});

export const UserEmailResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: UserEmailSchema
});

export const UserEmailArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(UserEmailSchema)
});