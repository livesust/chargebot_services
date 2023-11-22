import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { UserSchema } from "../user/user.schema";

const UserPhoneSchemaDef = {
    phone_number: Joi.string(),
    send_text: Joi.boolean(),
    primary: Joi.boolean(),
};

export const UserPhoneSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UserPhoneSchemaDef,
    user_id: Joi.number(),
    // uncoment to enable eager loading
    //user: UserSchema,
});

export const CreateUserPhoneSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...UserPhoneSchemaDef
}).keys({
    // overwrite keys for required attributes
    phone_number: Joi.string().required(),
    user_id: Joi.number().required(),
});;

export const UpdateUserPhoneSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...UserPhoneSchemaDef
});

export const SearchUserPhoneSchema = Joi.object({
    id: Joi.number(),
    ...UserPhoneSchemaDef
});

export const UserPhoneResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: UserPhoneSchema
});

export const UserPhoneArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(UserPhoneSchema)
});