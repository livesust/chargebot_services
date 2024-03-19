import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

import { EntitySchema as VehicleTypeSchema } from "./vehicle_type.schema";

const VehicleSchemaDef = {
    name: Joi.string(),
    license_plate: Joi.string(),
    notes: Joi.string().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...VehicleSchemaDef,
    vehicle_type_id: Joi.number(),
    
    vehicle_type: VehicleTypeSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...VehicleSchemaDef
}).keys({
    // overwrite keys for required attributes
    name: Joi.string().required(),
    license_plate: Joi.string().required(),
    vehicle_type_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...VehicleSchemaDef,
    vehicle_type_id: Joi.number(),
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    vehicle_type_id: Joi.number(),
    ...VehicleSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});