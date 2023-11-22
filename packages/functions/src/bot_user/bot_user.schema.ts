import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { BotSchema } from "../bot/bot.schema";
// uncoment to enable eager loading
//import { UserSchema } from "../user/user.schema";

const BotUserSchemaDef = {
    assignment_date: Joi.date(),
};

export const BotUserSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotUserSchemaDef,
    bot_id: Joi.number(),
    user_id: Joi.number(),
    // uncoment to enable eager loading
    //bot: BotSchema,
    // uncoment to enable eager loading
    //user: UserSchema,
});

export const CreateBotUserSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotUserSchemaDef
}).keys({
    // overwrite keys for required attributes
    assignment_date: Joi.date().required(),
    bot_id: Joi.number().required(),
    user_id: Joi.number().required(),
});;

export const UpdateBotUserSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotUserSchemaDef
});

export const SearchBotUserSchema = Joi.object({
    id: Joi.number(),
    ...BotUserSchemaDef
});

export const BotUserResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: BotUserSchema
});

export const BotUserArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(BotUserSchema)
});