import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const StateMasterSchemaDef = {
    name: Joi.string().max(100),
    abbreviation: Joi.string().max(45),
    country: Joi.string().max(255),
};

export const StateMasterSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...StateMasterSchemaDef,
});

export const CreateStateMasterSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...StateMasterSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(100).required(),
    abbreviation: Joi.string().max(45).required(),
    country: Joi.string().max(255).required(),
});;

export const UpdateStateMasterSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...StateMasterSchemaDef
});

export const SearchStateMasterSchema = Joi.object({
    id: Joi.number(),
    ...StateMasterSchemaDef
});

export const StateMasterResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: StateMasterSchema
});

export const StateMasterArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(StateMasterSchema)
});