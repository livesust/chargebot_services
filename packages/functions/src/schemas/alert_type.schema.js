Joi.object({
    id: Joi.number().optional().allow(null),
    another_id: Joi.number(),
    created_date: Joi.date().optional().allow(null),
    modified_by: Joi.string().optional().allow(null),
    string: Joi.string(),
    description: Joi.string().allow(null),
    color_code: Joi.string().max(100),
    name: Joi.string().max(255),
    priority: Joi.string().max(255).allow(null),
    send_push: Joi.boolean().allow(null)
});