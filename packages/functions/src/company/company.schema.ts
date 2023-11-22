import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { CustomerSchema } from "../customer/customer.schema";
import { HomeMasterSchema } from "../home_master/home_master.schema";

const CompanySchemaDef = {
    name: Joi.string().max(255),
    emergency_phone: Joi.string().max(255),
    emergency_email: Joi.string().max(255),
};

export const CompanySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...CompanySchemaDef,
    customer_id: Joi.number(),
    home_master_id: Joi.number(),
    // uncoment to enable eager loading
    //customer: CustomerSchema,
    home_master: HomeMasterSchema,
});

export const CreateCompanySchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...CompanySchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(255).required(),
    customer_id: Joi.number().required(),
    home_master_id: Joi.number().required(),
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