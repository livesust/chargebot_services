import Joi from 'joi';

export const ControlOutletSchema = Joi.object({
  pdu_outlet_number: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8).required(),
  command: Joi.string().valid(
    'start_priority_charge',
    'stop_priority_charge',
    'set_schedule'
  ).required(),
  params: Joi.object({
    all_day: Joi.boolean(),
    start_time: Joi.date().allow(null),
    end_time: Joi.date().allow(null),
  })
});
