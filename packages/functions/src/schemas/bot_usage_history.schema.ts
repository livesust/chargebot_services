import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const UsageSchemaDef = {
    bot_uuid: Joi.string().allow(null),
    timestamp: Joi.date().allow(null),
    energy_usage: Joi.number().allow(null),
    total_charging: Joi.number().allow(null),
    grid_charging: Joi.number().allow(null),
    solar_charging: Joi.number().allow(null),
    battery_level: Joi.number().allow(null),
    hourly: Joi.array().items({
      hour_of_day: Joi.number().allow(null),
      energy_usage: Joi.number().allow(null),
      total_charging: Joi.number().allow(null),
      grid_charging: Joi.number().allow(null),
      solar_charging: Joi.number().allow(null),
      battery_level: Joi.number().allow(null),
    }).allow(null),
};

export const EntitySchema = Joi.object({
    ...UsageSchemaDef,
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
  date: Joi.date().required()
});