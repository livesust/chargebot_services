import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as EquipmentSchema } from "./equipment.schema";

import { EntitySchema as OutletSchema } from "./outlet.schema";

import { EntitySchema as UserSchema } from "./user.schema";

const OutletEquipmentSchemaDef = {
    notes: Joi.string().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...OutletEquipmentSchemaDef,
    equipment_id: Joi.number(),
    outlet_id: Joi.number(),
    user_id: Joi.number(),
    
    equipment: EquipmentSchema.allow(null),
    
    outlet: OutletSchema.allow(null),
    
    user: UserSchema.allow(null),
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...OutletEquipmentSchemaDef
}).keys({
    // overwrite keys for required attributes
    equipment_id: Joi.number().required(),
    outlet_id: Joi.number().required(),
    user_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...OutletEquipmentSchemaDef,
    equipment_id: Joi.number(),
    outlet_id: Joi.number(),
    user_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    equipment_id: Joi.number(),
    outlet_id: Joi.number(),
    user_id: Joi.number(),
    ...OutletEquipmentSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});