import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { OutletTypeSchema } from "../outlet_type/outlet_type.schema";
// uncoment to enable eager loading
//import { BotSchema } from "../bot/bot.schema";

const OutletSchemaDef = {
    pdu_outlet_number: Joi.number(),
    notes: Joi.string(),
};

export const OutletSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...OutletSchemaDef,
    outlet_type_id: Joi.number(),
    bot_id: Joi.number(),
    outlet_type: OutletTypeSchema,
    // uncoment to enable eager loading
    //bot: BotSchema,
});

export const CreateOutletSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...OutletSchemaDef
}).keys({
    // overwrite keys for required attributes
    pdu_outlet_number: Joi.number().required(),
    outlet_type_id: Joi.number().required(),
    bot_id: Joi.number().required(),
});;

export const UpdateOutletSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...OutletSchemaDef
});

export const SearchOutletSchema = Joi.object({
    id: Joi.number(),
    ...OutletSchemaDef
});

export const OutletResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: OutletSchema
});

export const OutletArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(OutletSchema)
});