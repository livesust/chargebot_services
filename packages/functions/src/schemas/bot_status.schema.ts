import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const BotStatusSchemaDef = {
    name: Joi.string(),
    display_on_dashboard: Joi.boolean().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotStatusSchemaDef,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotStatusSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotStatusSchemaDef,
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    ...BotStatusSchemaDef
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