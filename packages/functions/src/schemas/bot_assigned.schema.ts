import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const BotAssignedSchemaDef = {
    id: Joi.number(),
    bot_uuid: Joi.string(),
    name: Joi.string(),
    initials: Joi.string().allow(null),
    pin_color: Joi.string().allow(null),
    battery_level: Joi.number().allow(null),
    battery_status: Joi.string().allow(null)
};

export const EntitySchema = Joi.object({
    ...BotAssignedSchemaDef,
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});