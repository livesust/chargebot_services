import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const BotAssetTrackerStatusSchemaDef = {
    bot_uuid: Joi.string().allow(null, ''),
    rfid: Joi.string().allow(null, ''),
    equipment_id: Joi.number().optional().allow(null),
    equipment_name: Joi.string().allow(null, ''),
    timestamp: Joi.date().allow(null),
    status: Joi.string().allow(null, ''),
    last_known_latitude: Joi.number().allow(null),
    last_known_longitude: Joi.number().allow(null),
    last_known_address: Joi.string().allow(null, ''),
};

export const EntitySchema = Joi.object({
    ...BotAssetTrackerStatusSchemaDef,
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