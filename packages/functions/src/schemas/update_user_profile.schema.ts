import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";
import { EntitySchema as CompanySchema } from "./company.schema";
import { EntitySchema as CustomerSchema } from "./customer.schema";
import { EntitySchema as HomeMasterSchema } from "./home_master.schema";

export const PathParamSchema = Joi.object({
  cognito_id: Joi.string().required()
});

const UserProfileSchemaDef = {
  id: Joi.number().optional().allow(null),
  first_name: Joi.string().max(255),
  last_name: Joi.string().max(255),
  title: Joi.string().max(255).allow(null, ''),
  photo: Joi.string().allow(null, ''),
  email_address: Joi.string().email(),
  phone_number: Joi.string().allow(null, ''),
  role_id: Joi.number(),
  role: Joi.string(),
  onboarding: Joi.boolean().allow(null),
  privacy_terms_last_accepted: Joi.date().allow(null),
  privacy_terms_version: Joi.string().max(100).allow(null, ''),
  company: CompanySchema.allow(null).keys({
    // overwrite keys for required attributes
    customer: CustomerSchema.allow(null),
    home_master: HomeMasterSchema.allow(null),
  }),
  home_master: HomeMasterSchema.allow(null),
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