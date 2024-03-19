import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as CustomerSchema } from "./customer.schema";

import { EntitySchema as HomeMasterSchema } from "./home_master.schema";

const CompanySchemaDef = {
    name: Joi.string().max(255),
    emergency_phone: Joi.string().max(255).allow(null),
    emergency_email: Joi.string().max(255).allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...CompanySchemaDef,
    customer_id: Joi.number(),
    home_master_id: Joi.number().allow(null),
    
    customer: CustomerSchema,
    
    home_master: HomeMasterSchema.allow(null),
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...CompanySchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(255).required(),
    customer_id: Joi.number().required(),
    home_master_id: Joi.number(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...CompanySchemaDef,
    customer_id: Joi.number(),
    home_master_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    customer_id: Joi.number(),
    home_master_id: Joi.number(),
    ...CompanySchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});