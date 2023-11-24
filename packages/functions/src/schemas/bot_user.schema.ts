import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { EntitySchema as BotSchema } from "./bot.schema";
// uncoment to enable eager loading
//import { EntitySchema as UserSchema } from "./user.schema";

const BotUserSchemaDef = {
    assignment_date: Joi.date(),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotUserSchemaDef,
    bot_id: Joi.number(),
    user_id: Joi.number(),
    // uncoment to enable eager loading
    //bot: BotSchema,
    // uncoment to enable eager loading
    //user: UserSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotUserSchemaDef
}).keys({
    // overwrite keys for required attributes
    assignment_date: Joi.date().required(),
    bot_id: Joi.number().required(),
    user_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotUserSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...BotUserSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});