import { transpileSchema } from '@middy/validator/transpile';
import { CreateSchemaDef, UpdateSchemaDef, PathParametersIdDef } from "../shared/schemas";

export const CreateBotSchema = transpileSchema({
    ...CreateSchemaDef,
    properties: {
        body: {
            type: "object",
            properties: {
                bot_uuid: { type: "string", format: "uuid" },
                name: { type: "string", minLength: 1 },
                initials: { type: "string", minLength: 2, maxLength: 2 },
                pin_color: { type: "string" },
            },
            required: [
                "bot_uuid",
                "name",
                "initials",
                "pin_color"
            ],
        }
    }
});

export const UpdateBotSchema = transpileSchema({
    ...UpdateSchemaDef,
    properties: {
        pathParameters: { ...PathParametersIdDef },
        body: {
            type: "object",
            properties: {
                name: { type: "string", minLength: 1 },
                initials: { type: "string", minLength: 2, maxLength: 2 },
                pin_color: { type: "string" },
            },
        },
    },
});
