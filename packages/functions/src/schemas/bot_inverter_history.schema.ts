import Joi from 'joi';
import { JsonResponseSchemaDef } from "../shared/schemas";

export const PathParamSchema = Joi.object({
  bot_uuid: Joi.string().required(),
  from: Joi.date().required(),
  to: Joi.date().required()
});

const BotInverterHistorySchemaDef = {
  bot_uuid: Joi.string().required(),
  date: Joi.date().required(),
  grid_current: Joi.array().items({
    date: Joi.date().allow(null),
    current: Joi.number().allow(null)
  }),
  solar_current: Joi.array().items({
    date: Joi.date().allow(null),
    current: Joi.number().allow(null)
  }),
  grid_charge_current: Joi.array().items({
    date: Joi.date().allow(null),
    current: Joi.number().allow(null)
  }),
  battery_voltage: Joi.array().items({
    date: Joi.date().allow(null),
    voltage: Joi.number().allow(null)
  }),
};

export const EntitySchema = Joi.object({
  ...BotInverterHistorySchemaDef,
});

export const ResponseSchema = Joi.object({
  ...JsonResponseSchemaDef,
  body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
  ...JsonResponseSchemaDef,
  body: Joi.array().items(EntitySchema)
});