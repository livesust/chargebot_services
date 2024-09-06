import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as BotSchema } from "./bot.schema";
import { EntitySchema as UserSchema } from "./user.schema";

const BotUserSchemaDef = {
    assignment_date: Joi.date(),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotUserSchemaDef,
    bot_id: Joi.number(),
    user_id: Joi.number(),
    
    bot: BotSchema,
    user: UserSchema,
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
    ...BotUserSchemaDef,
    bot_id: Joi.number(),
    user_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    bot_id: Joi.number(),
    user_id: Joi.number(),
    bot: BotSchema.allow(null),
    user: UserSchema.allow(null),
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