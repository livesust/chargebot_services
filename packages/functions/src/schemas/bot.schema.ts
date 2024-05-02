import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as BotVersionSchema } from "./bot_version.schema";

import { EntitySchema as VehicleSchema } from "./vehicle.schema";

const BotSchemaDef = {
    bot_uuid: Joi.string(),
    initials: Joi.string().max(2),
    name: Joi.string().max(255),
    pin_color: Joi.string().max(100).allow(null, ''),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotSchemaDef,
    bot_version_id: Joi.number(),
    vehicle_id: Joi.number().allow(null),
    
    bot_version: BotVersionSchema,
    
    vehicle: VehicleSchema.allow(null),
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotSchemaDef
}).keys({
    // overwrite keys for required attributes
    bot_uuid: Joi.string().required(),
    initials: Joi.string().max(2).required(),
    name: Joi.string().max(255).required(),
    bot_version_id: Joi.number().required(),
    vehicle_id: Joi.number(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotSchemaDef,
    bot_version_id: Joi.number(),
    vehicle_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    bot_version_id: Joi.number(),
    vehicle_id: Joi.number(),
    ...BotSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});