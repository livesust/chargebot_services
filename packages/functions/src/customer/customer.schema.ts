import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const CustomerSchemaDef = {
    name: Joi.string(),
    email: Joi.string(),
    first_order_date: Joi.date(),
};

export const CustomerSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...CustomerSchemaDef,
});

export const CreateCustomerSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...CustomerSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().required(),
});;

export const UpdateCustomerSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...CustomerSchemaDef
});

export const SearchCustomerSchema = Joi.object({
    id: Joi.number(),
    ...CustomerSchemaDef
});

export const CustomerResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: CustomerSchema
});

export const CustomerArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(CustomerSchema)
});