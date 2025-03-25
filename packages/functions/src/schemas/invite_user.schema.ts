import Joi from 'joi';

const InviteUserSchemaDef = {
  email_address: Joi.string()
    .email()
    .allow(null, ''),
  phone_number: Joi.string()
    .pattern(/^(?:\+1|1)?\s?(?:\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/)
    .message('Phone number must be in E.164 format: +[country code][number]')
    .allow(null, ''),
  role_id: Joi.number(),
  company_id: Joi.number().allow(null),
  bot_ids: Joi.array<number>(),
};

export const EntitySchema = Joi.object({
    ...InviteUserSchemaDef,
}).custom((obj, helper) => {
  const { email_address, phone_number } = obj;
  
  // Validar que al menos uno no sea null o string vacío
  if ((!email_address || email_address === '') && 
      (!phone_number || phone_number === '')) {
    return helper.message({
      custom: 'At least one contact method (email or phone) must be provided'
    });
  }
  
  return obj;
});