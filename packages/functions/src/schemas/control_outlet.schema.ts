import Joi from 'joi';

export const ControlOutletSchema = Joi.object({
  pdu_outlet_number: Joi.number().required(),
  command: Joi.allow(
    'start_priority_charge',
    'stop_priority_charge'
  ).required(),
});
