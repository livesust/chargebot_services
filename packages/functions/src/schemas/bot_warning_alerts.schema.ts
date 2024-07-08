import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const BotWarningAlertSchemaDef = {
    timestamp: Joi.date().allow(null),
    title: Joi.string().allow(null, ''),
    message: Joi.string().allow(null, ''),
};

export const EntitySchema = Joi.object({
    ...BotWarningAlertSchemaDef,
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});