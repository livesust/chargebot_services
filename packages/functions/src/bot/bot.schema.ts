import { transpileSchema } from '@middy/validator/transpile';
import { CreateSchemaDef, UpdateSchemaDef, SearchSchemaDef, PathParametersIdDef } from "../shared/schemas";

export const CreateBotSchema = transpileSchema({
    ...CreateSchemaDef,
    properties: {
        body: {
            type: "object",
            properties: {
                bot_uuid: { type: "string" },
                name: { type: "string" },
                initials: { type: "string" },
                pin_color: { type: "string" },
            },
            required: [
                "bot_uuid",
                "name",
                "initials",
                "pin_color",
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
                bot_uuid: { type: "string" },
                name: { type: "string" },
                initials: { type: "string" },
                pin_color: { type: "string" },
            },
        },
    },
});

export const SearchBotSchema = transpileSchema({
    ...SearchSchemaDef,
    properties: {
        pathParameters: { ...PathParametersIdDef },
        body: {
            type: "object",
            properties: {
                id: { type: "number" },
                bot_uuid: { type: "string" },
                name: { type: "string" },
                initials: { type: "string" },
                pin_color: { type: "string" },
                created_by: { type: "string" },
                modified_by: { type: "string" },
            },
        },
    },
});
