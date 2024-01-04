import Joi from 'joi';

export const ControlOutletSchema = Joi.object({
  pdu_outlet_number: Joi.number().required(),
  command: Joi.string().valid(
    'start_priority_charge',
    'stop_priority_charge'
  ).required(),
});
