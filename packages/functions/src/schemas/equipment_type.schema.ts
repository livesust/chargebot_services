import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const EquipmentTypeSchemaDef = {
    type: Joi.string().max(255),
    description: Joi.string(),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...EquipmentTypeSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...EquipmentTypeSchemaDef
}).keys({
    // overwrite keys for required attributes
    type: Joi.string().max(255).required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...EquipmentTypeSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...EquipmentTypeSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});