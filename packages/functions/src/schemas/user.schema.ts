import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as CompanySchema } from "./company.schema";

const UserSchemaDef = {
    first_name: Joi.string().max(255).allow(null, ''),
    last_name: Joi.string().max(255).allow(null, ''),
    title: Joi.string().max(255).allow(null, ''),
    photo: Joi.string().max(255).allow(null, ''),
    invite_status: Joi.string().allow(null),
    super_admin: Joi.boolean().allow(null),
    user_id: Joi.string().max(255),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UserSchemaDef,
    company_id: Joi.number(),
    
    company: CompanySchema,
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