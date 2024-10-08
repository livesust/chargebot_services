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
    id: Joi.number().optional().allow(null),
    timestamp: Joi.date().allow(null),
    latitude: Joi.number().allow(null),
    longitude: Joi.number().allow(null),
    vehicle_status: Joi.string().allow(null, ''),
    distance: Joi.number().allow(null),
  }),
  summary: Joi.array().items({
    id: Joi.number().optional().allow(null),
    start_time: Joi.date().allow(null),
    end_time: Joi.date().allow(null),
    timezone: Joi.string().allow(null, ''),
    latitude: Joi.number().allow(null),
    longitude: Joi.number().allow(null),
    distance: Joi.number().allow(null),
    vehicle_status: Joi.string().allow(null, ''),
    address: Joi.string().allow(null, ''),
    country: Joi.string().allow(null, ''),
    postal_code: Joi.string().allow(null, ''),
    state: Joi.string().allow(null, ''),
    county: Joi.string().allow(null, ''),
    city: Joi.string().allow(null, ''),
    neighborhood: Joi.string().allow(null, ''),
    street: Joi.string().allow(null, ''),
    address_number: Joi.string().allow(null, ''),
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