import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as BotSchema } from "./bot.schema";
import { EntitySchema as BotFirmwareVersionSchema } from "./bot_firmware_version.schema";

const BotFirmwareInstallSchemaDef = {
    install_date: Joi.date(),
    active: Joi.boolean(),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotFirmwareInstallSchemaDef,
    bot_id: Joi.number(),
    bot_firmware_version_id: Joi.number(),
    
    bot: BotSchema,
    bot_firmware_version: BotFirmwareVersionSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotFirmwareInstallSchemaDef
}).keys({
    // overwrite keys for required attributes
    install_date: Joi.date().required(),
    active: Joi.boolean().required(),
    bot_id: Joi.number().required(),
    bot_firmware_version_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotFirmwareInstallSchemaDef,
    bot_id: Joi.number(),
    bot_firmware_version_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    bot_id: Joi.number(),
    bot_firmware_version_id: Joi.number(),
    ...BotFirmwareInstallSchemaDef
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