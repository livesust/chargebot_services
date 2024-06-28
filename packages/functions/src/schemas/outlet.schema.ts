import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as OutletTypeSchema } from "./outlet_type.schema";

import { EntitySchema as BotSchema } from "./bot.schema";

const OutletSchemaDef = {
    pdu_outlet_number: Joi.number(),
    priority_charge_state: Joi.string().allow(null, ''),
    notes: Joi.string().allow(null, ''),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...OutletSchemaDef,
    outlet_type_id: Joi.number(),
    bot_id: Joi.number(),
    
    outlet_type: OutletTypeSchema,
    
    bot: BotSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...OutletSchemaDef
}).keys({
    // overwrite keys for required attributes
    pdu_outlet_number: Joi.number().required(),
    outlet_type_id: Joi.number().required(),
    bot_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...OutletSchemaDef,
    outlet_type_id: Joi.number(),
    bot_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    outlet_type_id: Joi.number(),
    bot_id: Joi.number(),
    ...OutletSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});