import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const BotStatusSchemaDef = {
    bot_uuid: Joi.string().allow(null, ''),
    online: Joi.bool().allow(null),
    uptime: Joi.number().allow(null),
    last_seen: Joi.date().allow(null),
    location_status: Joi.string().allow(null),
    address: Joi.string().allow(null),
    active_alerts: Joi.number().allow(null),
    active_alerts_24h: Joi.number().allow(null),
    battery_level: Joi.number().allow(null),
    battery_status: Joi.string().allow(null),
    inverter_connected: Joi.bool().allow(null),
    battery_connected: Joi.bool().allow(null),
    pdu_connected: Joi.bool().allow(null),
    gps_connected: Joi.bool().allow(null),
    temperature_connected: Joi.bool().allow(null),
    fan_connected: Joi.bool().allow(null),
};

export const EntitySchema = Joi.object({
    ...BotStatusSchemaDef,
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});