import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
// uncoment to enable eager loading
//import { OutletSchema } from "../outlet/outlet.schema";

const OutletScheduleSchemaDef = {
    all_day: Joi.boolean(),
    start_time: Joi.date(),
    end_time: Joi.date(),
};

export const OutletScheduleSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...OutletScheduleSchemaDef,
    outlet_id: Joi.number(),
    // uncoment to enable eager loading
    //outlet: OutletSchema,
});

export const CreateOutletScheduleSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...OutletScheduleSchemaDef
}).keys({
    // overwrite keys for required attributes
    start_time: Joi.date().required(),
    end_time: Joi.date().required(),
    outlet_id: Joi.number().required(),
});;

export const UpdateOutletScheduleSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...OutletScheduleSchemaDef
});

export const SearchOutletScheduleSchema = Joi.object({
    id: Joi.number(),
    ...OutletScheduleSchemaDef
});

export const OutletScheduleResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: OutletScheduleSchema
});

export const OutletScheduleArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(OutletScheduleSchema)
});