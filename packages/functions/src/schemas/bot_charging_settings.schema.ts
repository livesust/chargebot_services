import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { EntitySchema as BotSchema } from "./bot.schema";

const BotChargingSettingsSchemaDef = {
    day_of_week: Joi.string().max(255),
    all_day: Joi.boolean(),
    start_time: Joi.date().allow(null),
    end_time: Joi.date().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotChargingSettingsSchemaDef,
    bot_id: Joi.number(),
    // uncoment to enable eager loading
    //bot: BotSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotChargingSettingsSchemaDef
}).keys({
    // overwrite keys for required attributes
    day_of_week: Joi.string().max(255).required(),
    all_day: Joi.boolean().required(),
    bot_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotChargingSettingsSchemaDef,
    bot_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    bot_id: Joi.number(),
    ...BotChargingSettingsSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});

export const PaginateResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.object({
      records: Joi.array().items(EntitySchema),
      count: Joi.number()
    })
});