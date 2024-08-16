import Joi from 'joi';

const InviteUserSchemaDef = {
  email_address: Joi.string().email(),
  role_id: Joi.number(),
  company_id: Joi.number().allow(null),
  bot_ids: Joi.array<number>(),
};

export const EntitySchema = Joi.object({
    ...InviteUserSchemaDef,
});