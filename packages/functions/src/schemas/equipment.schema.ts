import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const EquipmentSchemaDef = {
    name: Joi.string().max(255),
    brand: Joi.string().max(255).allow(null),
    description: Joi.string().allow(null),
    voltage: Joi.number().allow(null),
    max_charging_amps: Joi.number().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...EquipmentSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...EquipmentSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(255).required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...EquipmentSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...EquipmentSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});