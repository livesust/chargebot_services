import Joi from 'joi';

export const PathParamSchema = Joi.object({
  bot_id: Joi.number().required(),
  company_id: Joi.number().required()
});