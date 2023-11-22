import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { CompanySchema } from "../company/company.schema";

const UserSchemaDef = {
    first_name: Joi.string().max(255),
    last_name: Joi.string().max(255),
    title: Joi.string().max(255),
    photo: Joi.string().max(255),
    invite_status: Joi.number(),
    super_admin: Joi.boolean(),
};

export const UserSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UserSchemaDef,
    company_id: Joi.number(),
    // uncoment to enable eager loading
    //company: CompanySchema,
});

export const CreateUserSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...UserSchemaDef
}).keys({
    // overwrite keys for required attributes
    first_name: Joi.string().max(255).required(),
    last_name: Joi.string().max(255).required(),
    company_id: Joi.number().required(),
});;

export const UpdateUserSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...UserSchemaDef
});

export const SearchUserSchema = Joi.object({
    id: Joi.number(),
    ...UserSchemaDef
});

export const UserResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: UserSchema
});

export const UserArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(UserSchema)
});