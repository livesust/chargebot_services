import Joi from 'joi';
import { JsonResponseSchemaDef } from "../shared/schemas";

export const PathParamSchema = Joi.object({
  bot_uuid: Joi.string().required(),
  from: Joi.date().required(),
  to: Joi.date().required()
});

const BotPDUHistorySchemaDef = {
  bot_uuid: Joi.string().required(),
  date: Joi.date().required(),
  current: Joi.array().items({
    date: Joi.number().allow(null),
    current: Joi.number().allow(null)
  }),
  state: Joi.array().items({
    start_date: Joi.date().allow(null),
    end_date: Joi.date().allow(null),
    pdu_state: Joi.string().allow(null, ''),
  })
};

export const EntitySchema = Joi.object({
  ...BotPDUHistorySchemaDef,
});

export const ResponseSchema = Joi.object({
  ...JsonResponseSchemaDef,
  body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
  ...JsonResponseSchemaDef,
  body: Joi.array().items(EntitySchema)
});