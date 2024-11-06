import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const BotStatusSchemaDef = {
    bot_uuid: Joi.string().allow(null, ''),
    temperature: Joi.number().allow(null),
    fan_status: Joi.bool().allow(null),
    battery_level: Joi.number().allow(null),
    battery_status: Joi.string().allow(null, ''),
    output_current: Joi.number().allow(null),
    grid_power: Joi.number().allow(null),
    solar_power: Joi.number().allow(null),
    today_energy_usage: Joi.number().allow(null),
    today_total_charging: Joi.number().allow(null),
    today_grid_charging: Joi.number().allow(null) ,
    today_solar_charging: Joi.number().allow(null),
    today_battery_charging: Joi.number().allow(null),
    today_battery_discharging: Joi.number().allow(null),
    pdu_status: Joi.string().allow(null, ''),
    connection_status: Joi.string().allow(null, ''),
    system_status: Joi.string().allow(null, ''),
    last_seen: Joi.date().allow(null),
};

export const EntitySchema = Joi.object({
    ...BotStatusSchemaDef,
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