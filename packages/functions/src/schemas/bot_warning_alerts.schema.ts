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

export const PaginateResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.object({
      records: Joi.array().items(EntitySchema),
      count: Joi.number()
    })
});