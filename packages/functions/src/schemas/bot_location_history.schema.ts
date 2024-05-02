import Joi from 'joi';
import { JsonResponseSchemaDef } from "../shared/schemas";

export const PathParamSchema = Joi.object({
  bot_uuid: Joi.string().required(),
  from: Joi.date().required(),
  to: Joi.date().required()
});

const BotLocationHistorySchemaDef = {
  bot_uuid: Joi.string().required(),
  date: Joi.date().required(),
  route: Joi.array().items({
    timestamp: Joi.date().allow(null),
    latitude: Joi.number().allow(null),
    longitude: Joi.number().allow(null),
    vehicle_status: Joi.string().allow(null, ''),
    distance: Joi.number().allow(null),
  }),
  summary: Joi.array().items({
    start_time: Joi.date().allow(null),
    end_time: Joi.date().allow(null),
    latitude: Joi.number().allow(null),
    longitude: Joi.number().allow(null),
    distance: Joi.number().allow(null),
    vehicle_status: Joi.string().allow(null, ''),
  })
};

export const EntitySchema = Joi.object({
  ...BotLocationHistorySchemaDef,
});

export const ResponseSchema = Joi.object({
  ...JsonResponseSchemaDef,
  body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
  ...JsonResponseSchemaDef,
  body: Joi.array().items(EntitySchema)
});