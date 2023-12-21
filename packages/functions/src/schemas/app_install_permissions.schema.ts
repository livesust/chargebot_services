import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { EntitySchema as AppInstallSchema } from "./app_install.schema";
import { EntitySchema as PermissionSchema } from "./permission.schema";

const AppInstallPermissionsSchemaDef = {
    permission_status: Joi.boolean().allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...AppInstallPermissionsSchemaDef,
    app_install_id: Joi.number(),
    permission_id: Joi.number(),
    app_install: AppInstallSchema,
    permission: PermissionSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...AppInstallPermissionsSchemaDef
}).keys({
    // overwrite keys for required attributes
    app_install_id: Joi.number().required(),
    permission_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...AppInstallPermissionsSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    app_install_id: Joi.number(),
    permission_id: Joi.number(),
    ...AppInstallPermissionsSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});