import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as BotSchema } from "./bot.schema";
import { EntitySchema as ComponentAttributeSchema } from "./component_attribute.schema";

const BotComponentAttributeSchemaDef = {
    value: Joi.string().allow(null, ''),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotComponentAttributeSchemaDef,
    bot_id: Joi.number(),
    component_attribute_id: Joi.number(),
    
    bot: BotSchema,
    component_attribute: ComponentAttributeSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotComponentAttributeSchemaDef
}).keys({
    // overwrite keys for required attributes
    bot_id: Joi.number().required(),
    component_attribute_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotComponentAttributeSchemaDef,
    bot_id: Joi.number(),
    component_attribute_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    bot_id: Joi.number(),
    component_attribute_id: Joi.number(),
    ...BotComponentAttributeSchemaDef
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