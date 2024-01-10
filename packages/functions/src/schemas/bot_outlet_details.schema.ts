import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const OutletDetailsSchemaDef = {
    id: Joi.number().allow(null),
    pdu_outlet_number: Joi.number().valid(1, 2, 3, 4, 5, 6, 7).allow(null),
    force_charge_now: Joi.boolean().allow(null),
    status: Joi.string().allow(null, 'ON', 'OFF'),
    status_timestamp: Joi.date().allow(null),
    equipment: Joi.object({
      id: Joi.number().allow(null),
      name: Joi.string().allow(null),
      brand: Joi.string().allow(null),
      equipment_type: Joi.object({
        id: Joi.number().allow(null),
        type: Joi.string().allow(null),
        description: Joi.string().allow(null),
      }).allow(null),
    }).allow(null),
    outlet_schedule: Joi.object({
      id: Joi.number().allow(null),
      all_day: Joi.boolean().allow(null),
      start_time: Joi.date().allow(null),
      end_time: Joi.date().allow(null),
      day_of_week: Joi.number().allow(null),
    }).allow(null),
};

export const EntitySchema = Joi.object({
    ...OutletDetailsSchemaDef,
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});

export const PathParamSchema = Joi.object({
  bot_uuid: Joi.string().uuid().required(),
  outlet_id: Joi.number().required()
});