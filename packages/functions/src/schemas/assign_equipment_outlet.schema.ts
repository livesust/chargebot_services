import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";
import { EntitySchema as EquipmentTypeSchema } from "./equipment_type.schema";
import { EntitySchema as OutletSchema } from "./outlet.schema";

export const PathParamSchema = Joi.object({
  equipment_id: Joi.number().required(),
  outlet_id: Joi.number().required()
});

export const QueryStringParamSchema = Joi.object({
  overwrite: Joi.boolean().allow(null).default(false)
});

const EquipmentsSchemaDef = {
  id: Joi.number().required(),
  name: Joi.string().max(255),
  brand: Joi.string().max(255).allow(null, ''),
  description: Joi.string().allow(null, ''),
  voltage: Joi.number().allow(null),
  max_charging_amps: Joi.number().allow(null),
  equipment_type_id: Joi.number(),
  customer_id: Joi.number(),
  equipment_type: EquipmentTypeSchema,
  outlet: OutletSchema
};

export const EntitySchema = Joi.object({
    ...EquipmentsSchemaDef,
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});