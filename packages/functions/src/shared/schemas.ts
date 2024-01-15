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
    id: Joi.number().optional().allow(null),
    created_by: Joi.string().optional().allow(null),
    created_date: Joi.date().optional().allow(null),
    modified_by: Joi.string().optional().allow(null),
    modified_date: Joi.date().optional().allow(null),
    deleted_by: Joi.string().optional().allow(null),
    deleted_date: Joi.date().optional().allow(null),
};

export const JsonResponseSchemaDef = {
    statusCode: Joi.number().required(),
    headers: Joi.object()
};

export const IdPathParamSchema = Joi.object({
    id: Joi.number().required()
});

export const EntityPathParamSchema = Joi.object({
    entity: Joi.string().required(),
});

export const BotUUIDPathParamSchema = Joi.object({
    bot_uuid: Joi.string().required()
});

export const EntityAndIdPathParamSchema = Joi.object({
    entity: Joi.string().required(),
    id: Joi.number().required()
});

export const SuccessResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.object()
});