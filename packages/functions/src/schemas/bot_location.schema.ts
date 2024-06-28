import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const BotLocationSchemaDef = {
    bot_uuid: Joi.string().allow(null, ''),
    timestamp: Joi.date().allow(null),
    vehicle_status: Joi.string().allow(null, ''),
    latitude: Joi.number().allow(null),
    longitude: Joi.number().allow(null),
    address: Joi.string().allow(null, ''),
    country: Joi.string().allow(null, ''),
    postal_code: Joi.string().allow(null, ''),
    state: Joi.string().allow(null, ''),
    county: Joi.string().allow(null, ''),
    city: Joi.string().allow(null, ''),
    neighborhood: Joi.string().allow(null, ''),
    street: Joi.string().allow(null, ''),
    address_number: Joi.string().allow(null, ''),
    altitude: Joi.number().allow(null),
    speed: Joi.number().allow(null),
    bearing: Joi.number().allow(null),
    arrived_at: Joi.date().allow(null),
    left_at: Joi.date().allow(null),
};

export const EntitySchema = Joi.object({
    ...BotLocationSchemaDef,
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});