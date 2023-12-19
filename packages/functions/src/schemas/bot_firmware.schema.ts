import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

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