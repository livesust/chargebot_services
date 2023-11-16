import { transpileSchema } from '@middy/validator/transpile';

export const PathParametersIdDef = {
    type: "object",
    properties: {
        id: { type: "number" },
    },
    required: ["id"],
};

export const CreateSchemaDef = {
    type: "object",
    required: ["body"]
};

export const UpdateSchemaDef = {
    type: "object",
    required: ["pathParameters", "body"]
};

export const SearchSchemaDef = {
    type: "object",
    required: ["body"]
};

export const IdPathParamSchema = transpileSchema({
    type: "object",
    required: ["pathParameters"],
    properties: {
        pathParameters: { ...PathParametersIdDef },
    },
});

export const JsonResponseSchema = transpileSchema({
    type: "object",
    required: ["statusCode"],
    properties: {
        body: {
            type: ["string", "null"]
        },
        statusCode: { type: "number" },
        headers: { type: "object" },
    },
});