import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const RoleSchemaDef = {
    role: Joi.string().max(255),
    description: Joi.string(),
};

export const RoleSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...RoleSchemaDef,
});

export const CreateRoleSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...RoleSchemaDef
}).keys({
    // overwrite keys for required attributes
    role: Joi.string().max(255).required(),
});;

export const UpdateRoleSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...RoleSchemaDef
});

export const SearchRoleSchema = Joi.object({
    id: Joi.number(),
    ...RoleSchemaDef
});

export const RoleResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: RoleSchema
});

export const RoleArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(RoleSchema)
});