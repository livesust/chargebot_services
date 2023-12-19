import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const OutletScheduleSchemaDef = {
    day_of_week: Joi.string().max(255).allow(null),
    all_day: Joi.boolean().allow(null),
    start_time: Joi.date(),
    end_time: Joi.date(),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...OutletScheduleSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...OutletScheduleSchemaDef
}).keys({
    // overwrite keys for required attributes
    start_time: Joi.date().required(),
    end_time: Joi.date().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...OutletScheduleSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
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