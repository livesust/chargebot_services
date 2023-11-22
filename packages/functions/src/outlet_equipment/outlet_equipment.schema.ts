import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { EquipmentSchema } from "../equipment/equipment.schema";
// uncoment to enable eager loading
//import { OutletSchema } from "../outlet/outlet.schema";
// uncoment to enable eager loading
//import { UserSchema } from "../user/user.schema";

const OutletEquipmentSchemaDef = {
    notes: Joi.string(),
};

export const OutletEquipmentSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...OutletEquipmentSchemaDef,
    equipment_id: Joi.number(),
    outlet_id: Joi.number(),
    user_id: Joi.number(),
    equipment: EquipmentSchema,
    // uncoment to enable eager loading
    //outlet: OutletSchema,
    // uncoment to enable eager loading
    //user: UserSchema,
});

export const CreateOutletEquipmentSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...OutletEquipmentSchemaDef
}).keys({
    // overwrite keys for required attributes
    equipment_id: Joi.number().required(),
    outlet_id: Joi.number().required(),
    user_id: Joi.number().required(),
});;

export const UpdateOutletEquipmentSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...OutletEquipmentSchemaDef
});

export const SearchOutletEquipmentSchema = Joi.object({
    id: Joi.number(),
    ...OutletEquipmentSchemaDef
});

export const OutletEquipmentResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: OutletEquipmentSchema
});

export const OutletEquipmentArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(OutletEquipmentSchema)
});