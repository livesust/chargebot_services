import Joi from 'joi';
import { JsonResponseSchemaDef } from "../shared/schemas";
import { EntitySchema as BotSchema } from "./bot.schema";

export const PathParamSchema = Joi.object({
  page: Joi.number().required(),
  pageSize: Joi.number().required(),
  sort: Joi.string().allow('asc', 'desc', null)
});

export const FiltersSchema = Joi.object({
    name: Joi.string().allow(null),
    bot_uuid: Joi.string().allow(null),
    customer_name: Joi.string().allow(null),
    company_name: Joi.string().allow(null),
    assigned: Joi.string().allow(null),
    display_on_dashboard: Joi.boolean().allow(null),
    is_offline: Joi.boolean().allow(null),
    has_system_error: Joi.boolean().allow(null),
    has_low_battery: Joi.boolean().allow(null),
    has_alerts: Joi.boolean().allow(null),
    has_24h_alerts: Joi.boolean().allow(null),
    is_at_home: Joi.boolean().allow(null),
    is_in_transit: Joi.boolean().allow(null),
    is_on_location: Joi.boolean().allow(null),
}).allow(null);

export const PaginateResponseSchema = Joi.object({
  ...JsonResponseSchemaDef,
  body: Joi.object({
    records: Joi.array().items(BotSchema),
    count: Joi.number()
  })
});