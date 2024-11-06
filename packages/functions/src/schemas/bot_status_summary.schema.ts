import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const BotStatusSummarySchemaDef = {
    total_bots: Joi.number().allow(null),
    low_battery_bots: Joi.number().allow(null),
    offline_bots: Joi.number().allow(null),
    avg_cpu: Joi.number().allow(null),
    max_cpu: Joi.number().allow(null),
    min_cpu: Joi.number().allow(null),
    avg_memory: Joi.number().allow(null),
    max_memory: Joi.number().allow(null),
    min_memory: Joi.number().allow(null),
    avg_disk: Joi.number().allow(null),
    max_disk: Joi.number().allow(null),
    min_disk: Joi.number().allow(null),
    avg_temperature: Joi.number().allow(null),
    max_temperature: Joi.number().allow(null),
    min_temperature: Joi.number().allow(null),
    avg_uptime: Joi.number().allow(null),
    max_uptime: Joi.number().allow(null),
    min_uptime: Joi.number().allow(null),
};

export const EntitySchema = Joi.object({
    ...BotStatusSummarySchemaDef,
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