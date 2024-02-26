import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

export const PathParamSchema = Joi.object({
  cognito_id: Joi.string().required()
});

const UserProfileSchemaDef = {
  id: Joi.number().optional().allow(null),
  first_name: Joi.string().max(255),
  last_name: Joi.string().max(255),
  title: Joi.string().max(255).allow(null),
  photo: Joi.string().allow(null),
  email_address: Joi.string().email(),
  phone_number: Joi.string(),
  role_id: Joi.number(),
  role: Joi.string(),
  modified_by: Joi.string(),
  modified_date: Joi.date()
};

export const EntitySchema = Joi.object({
    ...UserProfileSchemaDef,
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});