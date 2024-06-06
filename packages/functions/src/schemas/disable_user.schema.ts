import Joi from 'joi';

const DisableUserSchemaDef = {
  email_address: Joi.string().email(),
};

export const EntitySchema = Joi.object({
    ...DisableUserSchemaDef,
});