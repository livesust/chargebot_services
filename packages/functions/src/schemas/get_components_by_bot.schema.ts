import Joi from 'joi';

export const PathParamSchema = Joi.object({
  bot_id: Joi.string().required()
});