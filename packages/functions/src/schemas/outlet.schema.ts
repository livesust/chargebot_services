import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { EntitySchema as OutletTypeSchema } from "./outlet_type.schema";
// uncoment to enable eager loading
//import { EntitySchema as BotSchema } from "./bot.schema";

const OutletSchemaDef = {
    pdu_outlet_number: Joi.number(),
    notes: Joi.string().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...OutletSchemaDef,
    outlet_type_id: Joi.number(),
    bot_id: Joi.number(),
    outlet_type: OutletTypeSchema,
    // uncoment to enable eager loading
    //bot: BotSchema,
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
    ...OutletSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...OutletSchemaDef,
    outlet_type_id: Joi.number(),
    bot_id: Joi.number(),
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});