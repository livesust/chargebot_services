import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { AppInstallSchema } from "../app_install/app_install.schema";
import { PermissionSchema } from "../permission/permission.schema";

const AppInstallPermissionsSchemaDef = {
    permission_status: Joi.boolean(),
};

export const AppInstallPermissionsSchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...AppInstallPermissionsSchemaDef,
    app_install_id: Joi.number(),
    permission_id: Joi.number(),
    app_install: AppInstallSchema,
    permission: PermissionSchema,
});

export const CreateAppInstallPermissionsSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...AppInstallPermissionsSchemaDef
}).keys({
    // overwrite keys for required attributes
    app_install_id: Joi.number().required(),
    permission_id: Joi.number().required(),
});;

export const UpdateAppInstallPermissionsSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...AppInstallPermissionsSchemaDef
});

export const SearchAppInstallPermissionsSchema = Joi.object({
    id: Joi.number(),
    ...AppInstallPermissionsSchemaDef
});

export const AppInstallPermissionsResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: AppInstallPermissionsSchema
});

export const AppInstallPermissionsArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(AppInstallPermissionsSchema)
});