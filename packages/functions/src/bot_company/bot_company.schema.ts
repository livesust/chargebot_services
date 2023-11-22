import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { BotSchema } from "../bot/bot.schema";
import { CompanySchema } from "../company/company.schema";

const BotCompanySchemaDef = {
    acquire_date: Joi.date(),
};

export const BotCompanySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotCompanySchemaDef,
    bot_id: Joi.number(),
    company_id: Joi.number(),
    bot: BotSchema,
    company: CompanySchema,
});

export const CreateBotCompanySchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotCompanySchemaDef
}).keys({
    // overwrite keys for required attributes
    acquire_date: Joi.date().required(),
    bot_id: Joi.number().required(),
    company_id: Joi.number().required(),
});;

export const UpdateBotCompanySchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotCompanySchemaDef
});

export const SearchBotCompanySchema = Joi.object({
    id: Joi.number(),
    ...BotCompanySchemaDef
});

export const BotCompanyResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: BotCompanySchema
});

export const BotCompanyArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(BotCompanySchema)
});