import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";

const PermissionSchemaDef = {
    permission_name: Joi.string().max(255),
    description: Joi.string(),
};

export const PermissionSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...PermissionSchemaDef,
});

export const CreatePermissionSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...PermissionSchemaDef
}).keys({
    // overwrite keys for required attributes
    permission_name: Joi.string().max(255).required(),
});;

export const UpdatePermissionSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...PermissionSchemaDef
});

export const SearchPermissionSchema = Joi.object({
    id: Joi.number(),
    ...PermissionSchemaDef
});

export const PermissionResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: PermissionSchema
});

export const PermissionArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(PermissionSchema)
});