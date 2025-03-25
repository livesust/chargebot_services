import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as CompanySchema } from "./company.schema";
import { EntitySchema as UserEmailSchema } from "./user_email.schema";
import { EntitySchema as UserPhoneSchema } from "./user_phone.schema";
import { EntitySchema as RoleSchema } from "./role.schema";

const UserSchemaDef = {
    first_name: Joi.string().max(255).allow(null, ''),
    last_name: Joi.string().max(255).allow(null, ''),
    title: Joi.string().max(255).allow(null, ''),
    photo: Joi.string().max(255).allow(null, ''),
    invite_status: Joi.string().max(100).allow(null, ''),
    super_admin: Joi.boolean().allow(null),
    onboarding: Joi.boolean().allow(null),
    privacy_terms_last_accepted: Joi.date().allow(null),
    privacy_terms_version: Joi.string().max(100).allow(null, ''),
    user_id: Joi.string().max(255),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UserSchemaDef,
    company_id: Joi.number(),
    company: CompanySchema,
    user_email: UserEmailSchema.allow(null),
    user_phone: UserPhoneSchema.allow(null),
    role: RoleSchema.allow(null),
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...UserSchemaDef
}).keys({
    // overwrite keys for required attributes
    first_name: Joi.string().max(255).required(),
    last_name: Joi.string().max(255).required(),
    user_id: Joi.string().max(255).required(),
    company_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...UserSchemaDef,
    company_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    company_id: Joi.number(),
    email: Joi.string().allow(null, ''),
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

export const PaginateResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.object({
      records: Joi.array().items(EntitySchema),
      count: Joi.number()
    })
});