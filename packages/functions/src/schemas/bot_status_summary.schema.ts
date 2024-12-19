import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const BotStatusSummarySchemaDef = {
    total_bots: Joi.number().allow(null),
    offline_bots: Joi.number().allow(null),
    low_battery_bots: Joi.number().allow(null),
    active_alerts: Joi.number().allow(null),
    active_alerts_24h: Joi.number().allow(null),
    system_error_bots: Joi.number().allow(null),
    bots_at_home: Joi.number().allow(null),
    bots_in_transit: Joi.number().allow(null),
    bots_on_location: Joi.number().allow(null),
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