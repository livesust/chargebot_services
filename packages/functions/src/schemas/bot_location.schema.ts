import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const BotLocationSchemaDef = {
    bot_uuid: Joi.string().allow(null),
    timestamp: Joi.date().allow(null),
    vehicle_status: Joi.string().allow(null),
    latitude: Joi.number().allow(null),
    longitude: Joi.number().allow(null),
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