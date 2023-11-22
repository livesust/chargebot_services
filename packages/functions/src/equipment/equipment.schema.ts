import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { EquipmentTypeSchema } from "../equipment_type/equipment_type.schema";
// uncoment to enable eager loading
//import { CustomerSchema } from "../customer/customer.schema";

const EquipmentSchemaDef = {
    name: Joi.string().max(255),
    brand: Joi.string().max(255),
    description: Joi.string(),
    voltage: Joi.number(),
    max_charging_amps: Joi.number(),
};

export const EquipmentSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...EquipmentSchemaDef,
    equipment_type_id: Joi.number(),
    customer_id: Joi.number(),
    equipment_type: EquipmentTypeSchema,
    // uncoment to enable eager loading
    //customer: CustomerSchema,
});

export const CreateEquipmentSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...EquipmentSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(255).required(),
    equipment_type_id: Joi.number().required(),
    customer_id: Joi.number().required(),
});;

export const UpdateEquipmentSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...EquipmentSchemaDef
});

export const SearchEquipmentSchema = Joi.object({
    id: Joi.number(),
    ...EquipmentSchemaDef
});

export const EquipmentResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EquipmentSchema
});

export const EquipmentArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EquipmentSchema)
});