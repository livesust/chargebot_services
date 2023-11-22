import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const OutletTypeSchemaDef = {
    type: Joi.string().max(255),
    outlet_amps: Joi.number(),
    outlet_volts: Joi.number(),
    connector: Joi.string().max(100),
    description: Joi.string(),
};

export const OutletTypeSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...OutletTypeSchemaDef,
});

export const CreateOutletTypeSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...OutletTypeSchemaDef
}).keys({
    // overwrite keys for required attributes
    type: Joi.string().max(255).required(),
});;

export const UpdateOutletTypeSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...OutletTypeSchemaDef
});

export const SearchOutletTypeSchema = Joi.object({
    id: Joi.number(),
    ...OutletTypeSchemaDef
});

export const OutletTypeResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: OutletTypeSchema
});

export const OutletTypeArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(OutletTypeSchema)
});