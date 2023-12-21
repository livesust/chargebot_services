import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { EntitySchema as OutletSchema } from "./outlet.schema";

const OutletScheduleSchemaDef = {
    day_of_week: Joi.string().max(255).allow(null),
    all_day: Joi.boolean(),
    start_time: Joi.date().allow(null),
    end_time: Joi.date().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...OutletScheduleSchemaDef,
    outlet_id: Joi.number(),
    // uncoment to enable eager loading
    //outlet: OutletSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...OutletScheduleSchemaDef
}).keys({
    // overwrite keys for required attributes
    all_day: Joi.boolean().required(),
    outlet_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...OutletScheduleSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    outlet_id: Joi.number(),
    ...OutletScheduleSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});