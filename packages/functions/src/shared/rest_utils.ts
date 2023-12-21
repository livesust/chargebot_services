import { createError } from '@middy/util';
import { ObjectSchema } from "joi";
import { loadSchemas } from '../schemas';

// @ts-expect-error ignore any type for event
export const isWarmingUp = (event) => event.isWarmingUp === true

// @ts-expect-error ignore any type for body
export const createNotFoundResponse = (body) => {
    return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body,
    };
}

// @ts-expect-error ignore any type for body
export const createSuccessResponse = (body) => {
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body,
    };
}

// @ts-expect-error ignore any type for response
export const validateCreateBody = async (body, entity_name: string) => {
    const schemas = loadSchemas(entity_name);
    const responseSchema: ObjectSchema = schemas.CreateSchema;
    const { error: validationError } = responseSchema.validate(body);
    if (validationError) {
        // Bad Request
        const error = createError(500, validationError.message, { expose: true });
        const errorDetails = validationError.details.map(detail => detail.message);
        error.details = errorDetails;
        throw error;
    }
}

// @ts-expect-error ignore any type for response
export const validateUpdateBody = async (body, entity_name: string) => {
    const schemas = loadSchemas(entity_name);
    const responseSchema: ObjectSchema = schemas.UpdateSchema;
    const { error: validationError } = responseSchema.validate(body);
    if (validationError) {
        // Bad Request
        const error = createError(500, validationError.message, { expose: true });
        const errorDetails = validationError.details.map(detail => detail.message);
        error.details = errorDetails;
        throw error;
    }
}

// @ts-expect-error ignore any type for response
export const validateSearchBody = async (body, entity_name: string) => {
    const schemas = loadSchemas(entity_name);
    const responseSchema: ObjectSchema = schemas.SearchSchema;
    const { error: validationError } = responseSchema.validate(body);
    if (validationError) {
        // Bad Request
        const error = createError(500, validationError.message, { expose: true });
        const errorDetails = validationError.details.map(detail => detail.message);
        error.details = errorDetails;
        throw error;
    }
}

// @ts-expect-error ignore any type for response
export const validateResponse = async (response, entity_name: string) => {
    const schemas = loadSchemas(entity_name);
    const responseSchema: ObjectSchema = schemas.ResponseSchema;
    const { error: validationError } = responseSchema.validate(response);
    if (validationError) {
        // Bad Request
        const error = createError(500, validationError.message, { expose: true });
        const errorDetails = validationError.details.map(detail => detail.message);
        error.details = errorDetails;
        throw error;
    }
}

// @ts-expect-error ignore any type for response
export const validateArrayResponse = async (response, entity_name: string) => {
    const schemas = loadSchemas(entity_name);
    const responseSchema: ObjectSchema = schemas.ArrayResponseSchema;
    const { error: validationError } = responseSchema.validate(response);
    if (validationError) {
        // Bad Request
        const error = createError(500, validationError.message, { expose: true });
        const errorDetails = validationError.details.map(detail => detail.message);
        error.details = errorDetails;
        throw error;
    }
}
