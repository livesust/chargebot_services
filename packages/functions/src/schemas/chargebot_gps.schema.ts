import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const ChargebotGpsSchemaDef = {
    device_id: Joi.string().allow(null),
    device_version: Joi.string().allow(null),
    timestamp: Joi.date().allow(null),
    timezone: Joi.string().allow(null),
    lat: Joi.number().allow(null),
    lat_unit: Joi.string().allow(null),
    lon: Joi.number().allow(null),
    lon_unit: Joi.string().allow(null),
    altitude: Joi.number().allow(null),
    altitude_unit: Joi.string().allow(null),
    speed: Joi.number().allow(null),
    speed_unit: Joi.string().allow(null),
    bearing: Joi.number().allow(null),
    bearing_unit: Joi.string().allow(null),
    vehicle_status: Joi.string().allow(null),
    quality: Joi.number().allow(null),
    nav_mode: Joi.string().allow(null),
    error: Joi.string().allow(null).allow(""),
};

export const EntitySchema = Joi.object({
    ...ChargebotGpsSchemaDef,
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});