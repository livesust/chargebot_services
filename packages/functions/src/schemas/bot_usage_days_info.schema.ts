import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const UsageSchemaDef = {
    date: Joi.date().allow(null),
    has_data: Joi.boolean().allow(null)
};

export const EntitySchema = Joi.object({
    ...UsageSchemaDef,
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});

export const PathParamSchema = Joi.object({
  bot_uuid: Joi.string().required(),
  from: Joi.date().required(),
  to: Joi.date().required()
});