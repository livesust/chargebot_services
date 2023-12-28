import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const MonthlyUsageSchemaDef = {
    bot_uuid: Joi.string().allow(null),
    monthly_energy_usage: Joi.number().allow(null),
    yearly_energy_usage: Joi.number().allow(null),
    monthly: Joi.array().items({
      day_of_month: Joi.number().allow(null),
      energy_usage: Joi.number().allow(null),
    }).allow(null),
    yearly: Joi.array().items({
      month_of_year: Joi.number().allow(null),
      energy_usage: Joi.number().allow(null),
    }).allow(null),
};

export const EntitySchema = Joi.object({
    ...MonthlyUsageSchemaDef,
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