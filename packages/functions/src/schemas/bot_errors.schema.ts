import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const BotErrorsSchemaDef = {
    bot_uuid: Joi.string().required(),
    active: Joi.array().items({
      timestamp: Joi.date().allow(null),
      title: Joi.string().allow(null, ''),
      message: Joi.string().allow(null, ''),
      module: Joi.string().allow(null, ''),
      level: Joi.string().allow(null, ''),
      severity: Joi.string().allow(null, ''),
      code: Joi.string().allow(null, ''),
      name: Joi.string().allow(null, ''),
      error_status: Joi.string().allow(null, ''),
      resolved_on: Joi.date().allow(null),
      occurrence_count: Joi.number().allow(null),
    }),
    past: Joi.array().items({
      timestamp: Joi.date().allow(null),
      title: Joi.string().allow(null, ''),
      message: Joi.string().allow(null, ''),
      module: Joi.string().allow(null, ''),
      level: Joi.string().allow(null, ''),
      severity: Joi.string().allow(null, ''),
      code: Joi.string().allow(null, ''),
      name: Joi.string().allow(null, ''),
      error_status: Joi.string().allow(null, ''),
      resolved_on: Joi.date().allow(null),
      occurrence_count: Joi.number().allow(null),
    }),
};

export const EntitySchema = Joi.object({
    ...BotErrorsSchemaDef,
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});