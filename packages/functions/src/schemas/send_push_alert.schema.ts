import Joi from 'joi';

const SendAlertSchemaDef = {
  bot_uuid: Joi.string().allow(null, ''),
  device_id: Joi.string().allow(null, ''),
  device_version: Joi.string().max(255).allow(null, ''),
  timestamp: Joi.date().allow(null),
  code: Joi.string().max(255).allow(null, ''),
  name: Joi.string().max(255).allow(null, ''),
  message: Joi.string().allow(null, ''),
  payload: Joi.string().allow(null, ''),
};

export const EntitySchema = Joi.object({
    ...SendAlertSchemaDef,
});