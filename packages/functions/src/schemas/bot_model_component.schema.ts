import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as BotModelSchema } from "./bot_model.schema";
import { EntitySchema as ComponentSchema } from "./component.schema";

const BotModelComponentSchemaDef = {
    assignment_date: Joi.date().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotModelComponentSchemaDef,
    bot_model_id: Joi.number(),
    component_id: Joi.number(),
    
    bot_model: BotModelSchema,
    component: ComponentSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotModelComponentSchemaDef
}).keys({
    // overwrite keys for required attributes
    bot_model_id: Joi.number().required(),
    component_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotModelComponentSchemaDef,
    bot_model_id: Joi.number(),
    component_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    bot_model_id: Joi.number(),
    component_id: Joi.number(),
    ...BotModelComponentSchemaDef
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