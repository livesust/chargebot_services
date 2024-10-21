import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as ComponentSchema } from "./component.schema";

const ComponentAttributeSchemaDef = {
    name: Joi.string().max(255),
    type: Joi.string().max(255).allow(null, ''),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...ComponentAttributeSchemaDef,
    component_id: Joi.number(),
    
    component: ComponentSchema,
}).id('componentAttributeSchema');

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...ComponentAttributeSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().max(255).required(),
    component_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...ComponentAttributeSchemaDef,
    component_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    component_id: Joi.number(),
    ...ComponentAttributeSchemaDef
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