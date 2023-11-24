import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { EntitySchema as CompanySchema } from "./company.schema";

const UserSchemaDef = {
    first_name: Joi.string().max(255),
    last_name: Joi.string().max(255),
    title: Joi.string().max(255),
    photo: Joi.string().max(255),
    invite_status: Joi.number(),
    super_admin: Joi.boolean(),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...UserSchemaDef,
    company_id: Joi.number(),
    // uncoment to enable eager loading
    //company: CompanySchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...UserSchemaDef
}).keys({
    // overwrite keys for required attributes
    first_name: Joi.string().max(255).required(),
    last_name: Joi.string().max(255).required(),
    company_id: Joi.number().required(),
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