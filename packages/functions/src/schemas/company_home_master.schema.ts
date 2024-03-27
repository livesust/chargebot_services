import Joi from 'joi';

export const PathParamSchema = Joi.object({
  company_id: Joi.string().required()
});