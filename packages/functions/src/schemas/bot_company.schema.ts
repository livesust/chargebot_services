import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { EntitySchema as BotSchema } from "./bot.schema";
import { EntitySchema as CompanySchema } from "./company.schema";

const BotCompanySchemaDef = {
    acquire_date: Joi.date(),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotCompanySchemaDef,
    bot_id: Joi.number(),
    company_id: Joi.number(),
    bot: BotSchema,
    company: CompanySchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotCompanySchemaDef
}).keys({
    // overwrite keys for required attributes
    acquire_date: Joi.date().required(),
    bot_id: Joi.number().required(),
    company_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotCompanySchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...BotCompanySchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});