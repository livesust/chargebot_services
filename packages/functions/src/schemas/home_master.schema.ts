import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as StateMasterSchema } from "./state_master.schema";

const HomeMasterSchemaDef = {
    address_line_1: Joi.string(),
    address_line_2: Joi.string().allow(null),
    city: Joi.string().max(100),
    zip_code: Joi.string().max(100),
    latitude: Joi.number(),
    longitude: Joi.number(),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...HomeMasterSchemaDef,
    state_master_id: Joi.number(),
    
    state_master: StateMasterSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...HomeMasterSchemaDef
}).keys({
    // overwrite keys for required attributes
    address_line_1: Joi.string().required(),
    city: Joi.string().max(100).required(),
    zip_code: Joi.string().max(100).required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    state_master_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...HomeMasterSchemaDef,
    state_master_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    state_master_id: Joi.number(),
    ...HomeMasterSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});