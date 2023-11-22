import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const EquipmentTypeSchemaDef = {
    type: Joi.string().max(255),
    description: Joi.string(),
};

export const EquipmentTypeSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...EquipmentTypeSchemaDef,
});

export const CreateEquipmentTypeSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...EquipmentTypeSchemaDef
}).keys({
    // overwrite keys for required attributes
    type: Joi.string().max(255).required(),
});;

export const UpdateEquipmentTypeSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...EquipmentTypeSchemaDef
});

export const SearchEquipmentTypeSchema = Joi.object({
    id: Joi.number(),
    ...EquipmentTypeSchemaDef
});

export const EquipmentTypeResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EquipmentTypeSchema
});

export const EquipmentTypeArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EquipmentTypeSchema)
});