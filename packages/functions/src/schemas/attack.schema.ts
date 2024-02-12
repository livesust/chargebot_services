import Joi from 'joi';

export const PathParamSchema = Joi.object({
  param: Joi.string()
});