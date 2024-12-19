import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const BotStatusSchemaDef = {
    bot_uuid: Joi.string().allow(null, ''),
    iot: Joi.object({
      connected: Joi.bool().allow(null),
      last_seen: Joi.date().allow(null),
    }),
    pi: Joi.object({
      cpu: Joi.number().allow(null),
      memory: Joi.number().allow(null),
      disk: Joi.number().allow(null),
      temperature: Joi.number().allow(null),
      uptime: Joi.number().allow(null),
      undervoltage: Joi.number().allow(null),
    }),
    inverter: Joi.object({
      connected: Joi.bool().allow(null),
      last_seen: Joi.date().allow(null),
    }),
    battery: Joi.object({
      connected: Joi.bool().allow(null),
      last_seen: Joi.date().allow(null),
    }),
    pdu: Joi.object({
      connected: Joi.bool().allow(null),
      last_seen: Joi.date().allow(null),
    }),
    gps: Joi.object({
      connected: Joi.bool().allow(null),
      last_seen: Joi.date().allow(null),
    }),
    temperature_sensor: Joi.object({
      connected: Joi.bool().allow(null),
      last_seen: Joi.date().allow(null),
    }),
    fan: Joi.object({
      connected: Joi.bool().allow(null),
      last_seen: Joi.date().allow(null),
    }),
};

export const EntitySchema = Joi.object({
    ...BotStatusSchemaDef,
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});