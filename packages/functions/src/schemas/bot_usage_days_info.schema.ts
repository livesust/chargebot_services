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

export const PaginateResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.object({
      records: Joi.array().items(EntitySchema),
      count: Joi.number()
    })
});

export const PathParamSchema = Joi.object({
  bot_uuid: Joi.string().required(),
  from: Joi.date().required(),
  to: Joi.date().required()
});