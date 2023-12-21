import Joi from 'joi';
import { AuditedEntityCreateSchemaDef, AuditedEntityUpdateSchemaDef, AuditedEntitySchemaDef, JsonResponseSchemaDef } from "../shared/schemas";
import { EntitySchema as BotSchema } from "./bot.schema";
import { EntitySchema as ComponentSchema } from "./component.schema";

const BotComponentSchemaDef = {
    install_date: Joi.date(),
    component_serial: Joi.string().max(255).allow(null),
};

export const EntitySchema = Joi.object({
    ...AuditedEntitySchemaDef,
    ...BotComponentSchemaDef,
    bot_id: Joi.number(),
    component_id: Joi.number(),
    bot: BotSchema,
    component: ComponentSchema,
});

export const CreateSchema = Joi.object({
    ...AuditedEntityCreateSchemaDef,
    ...BotComponentSchemaDef
}).keys({
    // overwrite keys for required attributes
    install_date: Joi.date().required(),
    bot_id: Joi.number().required(),
    component_id: Joi.number().required(),
});

export const UpdateSchema = Joi.object({
    ...AuditedEntityUpdateSchemaDef,
    ...BotComponentSchemaDef
});

export const SearchSchema = Joi.object({
    id: Joi.number(),
    bot_id: Joi.number(),
    component_id: Joi.number(),
    ...BotComponentSchemaDef
});

export const ResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: EntitySchema
});

export const ArrayResponseSchema = Joi.object({
    ...JsonResponseSchemaDef,
    body: Joi.array().items(EntitySchema)
});