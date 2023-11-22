import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { StateMasterSchema } from "../state_master/state_master.schema";

const HomeMasterSchemaDef = {
    address_line_1: Joi.string(),
    address_line_2: Joi.string(),
    city: Joi.string().max(100),
    zip_code: Joi.string().max(100),
    latitude: Joi.number(),
    longitude: Joi.number(),
};

export const HomeMasterSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...HomeMasterSchemaDef,
    state_master_id: Joi.number(),
    state_master: StateMasterSchema,
});

export const CreateHomeMasterSchema = Joi.object({
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
});;

export const UpdateHomeMasterSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...HomeMasterSchemaDef
});

export const SearchHomeMasterSchema = Joi.object({
    id: Joi.number(),
    ...HomeMasterSchemaDef
});

export const HomeMasterResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: HomeMasterSchema
});

export const HomeMasterArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(HomeMasterSchema)
});