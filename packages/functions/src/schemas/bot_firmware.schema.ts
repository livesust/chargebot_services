import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { EntitySchema as BotSchema } from "./bot.schema";

const BotFirmwareSchemaDef = {
    inverter_version: Joi.string().max(255),
    pi_version: Joi.string().max(255),
    firmware_version: Joi.string().max(255),
    battery_version: Joi.string().max(255),
    pdu_version: Joi.string().max(255),
    notes: Joi.string().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotFirmwareSchemaDef,
    bot_id: Joi.number(),
    // uncoment to enable eager loading
    //bot: BotSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotFirmwareSchemaDef
}).keys({
    // overwrite keys for required attributes
    inverter_version: Joi.string().max(255).required(),
    pi_version: Joi.string().max(255).required(),
    firmware_version: Joi.string().max(255).required(),
    battery_version: Joi.string().max(255).required(),
    pdu_version: Joi.string().max(255).required(),
    bot_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotFirmwareSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...BotFirmwareSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});