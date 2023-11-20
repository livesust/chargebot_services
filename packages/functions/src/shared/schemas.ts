import Joi from 'joi';

export const AuditedEntityCreateSchemaDef = {
    created_by: Joi.string().required(),
    created_date: Joi.date().required(),
    modified_by: Joi.string().optional().allow(null),
    modified_date: Joi.date().optional().allow(null),
    deleted_by: Joi.string().optional().allow(null),
    deleted_date: Joi.date().optional().allow(null),
};

export const AuditedEntityUpdateSchemaDef = {
    created_by: Joi.string().optional().allow(null),
    created_date: Joi.date().optional().allow(null),
    modified_by: Joi.string().optional().allow(null),
    modified_date: Joi.date().optional().allow(null),
    deleted_by: Joi.string().optional().allow(null),
    deleted_date: Joi.date().optional().allow(null),
};

export const AuditedEntitySchemaDef = {
    id: Joi.number().required(),
    created_by: Joi.string().required(),
    created_date: Joi.date().required(),
    modified_by: Joi.string().required(),
    modified_date: Joi.date().required(),
    deleted_by: Joi.string().optional().allow(null),
    deleted_date: Joi.date().optional().allow(null),
};

export const JsonResponseSchemaDef = {
    statusCode: Joi.number().required(),
    headers: Joi.object()
};

export const IdPathParamSchema = Joi.object({
    pathParameters: Joi.object({ id: Joi.number().required() }).required()
});

export const SuccessResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.object()
});