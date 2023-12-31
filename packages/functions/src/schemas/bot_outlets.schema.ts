import Joi from 'joi';
import {  JsonResponseSchemaDef } from "../shared/schemas";

const BotOutletSchemaDef = {
    id: Joi.number().allow(null),
    pdu_outlet_number: Joi.number().allow(null),
    force_charge_now: Joi.boolean().allow(null),
    status: Joi.string().allow(null, 'ON', 'OFF'),
    status_timestamp: Joi.date().allow(null)
};

export const EntitySchema = Joi.object({
    ...BotOutletSchemaDef,
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});