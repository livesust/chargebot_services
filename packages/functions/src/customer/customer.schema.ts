import { transpileSchema } from '@middy/validator/transpile';
import { CreateSchemaDef, UpdateSchemaDef, SearchSchemaDef, PathParametersIdDef } from "../shared/schemas";

export const CreateCustomerSchema = transpileSchema({
    ...CreateSchemaDef,
    properties: {
        body: {
            type: "object",
            properties: {
                name: { type: "string" },
                email: { type: "string" },
                first_order_date: { type: "Date" },
            },
            required: [
                "name",
                                ],
        }
    }
});

export const UpdateCustomerSchema = transpileSchema({
    ...UpdateSchemaDef,
    properties: {
        pathParameters: { ...PathParametersIdDef },
        body: {
            type: "object",
            properties: {
                name: { type: "string" },
                email: { type: "string" },
                first_order_date: { type: "Date" },
            },
        },
    },
});

export const SearchCustomerSchema = transpileSchema({
    ...SearchSchemaDef,
    properties: {
        body: {
            type: "object",
            properties: {
                id: { type: "number" },
                name: { type: "string" },
                email: { type: "string" },
                first_order_date: { type: "Date" },
            },
        },
    },
});
