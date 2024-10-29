import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as EquipmentTypeSchema } from "./equipment_type.schema";

import { EntitySchema as CustomerSchema } from "./customer.schema";

const EquipmentSchemaDef = {
    name: Joi.string().max(255),
    brand: Joi.string().max(255).allow(null, ''),
    rfid: Joi.string().max(255).allow(null, ''),
    description: Joi.string().allow(null, ''),
    voltage: Joi.number().allow(null),
    max_charging_amps: Joi.number().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...EquipmentSchemaDef,
    equipment_type_id: Joi.number(),
    customer_id: Joi.number(),
    
    equipment_type: EquipmentTypeSchema,
    
    customer: CustomerSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...EquipmentSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(255).required(),
    equipment_type_id: Joi.number().required(),
    customer_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...EquipmentSchemaDef,
    equipment_type_id: Joi.number(),
    customer_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    equipment_type_id: Joi.number(),
    customer_id: Joi.number(),
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

export const PaginateResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.object({
      records: Joi.array().items(EntitySchema),
      count: Joi.number()
    })
});