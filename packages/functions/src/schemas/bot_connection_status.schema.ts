import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const BotConnectionStatusSchemaDef = {
    bot_uuid: Joi.string().allow(null, ''),
    battery_level: Joi.number().allow(null),
    battery_status: Joi.string().allow(null, ''),
    connection_status: Joi.string().allow(null, ''),
};

export const EntitySchema = Joi.object({
    ...BotConnectionStatusSchemaDef,
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