import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { CustomerSchema } from "../customer/customer.schema";

const CompanySchemaDef = {
    name: Joi.string().max(255),
    emergency_phone: Joi.string().max(255),
    emergency_email: Joi.string().max(255),
};

export const CompanySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...CompanySchemaDef,
    customer_id: Joi.number(),
    // uncoment to enable eager loading
    //customer: CustomerSchema,
});

export const CreateCompanySchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...CompanySchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(255).required(),
    customer_id: Joi.number(),
});;

export const UpdateCompanySchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...CompanySchemaDef
});

export const SearchCompanySchema = Joi.object({
    id: Joi.number(),
    ...CompanySchemaDef
});

export const CompanyResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: CompanySchema
});

export const CompanyArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(CompanySchema)
});