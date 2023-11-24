import middy from '@middy/core';
import { createError } from '@middy/util';
import Joi, { ValidationOptions } from 'joi';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export interface Options {
    eventSchema?: Joi.AnySchema | undefined;
    eventValidationOptions?: ValidationOptions | undefined;
    pathParametersSchema?: Joi.AnySchema | undefined;
    pathParametersValidationOptions?: ValidationOptions | undefined;
    headersSchema?: Joi.AnySchema | undefined;
    headersValidationOptions?: ValidationOptions | undefined;
    responseSchema?: Joi.AnySchema | undefined;
    responseValidationOptions?: ValidationOptions | undefined;
}

const defaultOptions: Options = {
    headersValidationOptions: {
        allowUnknown: true,
    },
}

const middleware = (options: Options): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
    const {
        eventSchema,
        eventValidationOptions,
        pathParametersSchema,
        pathParametersValidationOptions,
        headersSchema,
        headersValidationOptions,
        responseSchema,
        responseValidationOptions,
    } = { ...defaultOptions, ...options }

    const onBefore: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
        request
    ): Promise<void> => {
        if (headersSchema) {
            const { error: validationError, value } = headersSchema.validate(request.event.headers, headersValidationOptions);
            if (validationError) {
                // Bad Request
                const error = createError(400, `Header: ${validationError.message}`);
                const errorDetails = validationError.details.map(detail => detail.message);
                error.details = errorDetails;
                throw error;
            }
            request.event.headers = value;
        }
        if (eventSchema) {
            const { error: validationError, value } = eventSchema.validate(request.event.body, eventValidationOptions);
            if (validationError) {
                // Bad Request
                const error = createError(400, validationError.message);
                const errorDetails = validationError.details.map(detail => detail.message);
                error.details = errorDetails;
                throw error;
            }
            request.event.body = value;
        }
        if (pathParametersSchema) {
            const { error: validationError } = pathParametersSchema.validate(request.event.pathParameters, pathParametersValidationOptions);
            if (validationError) {
                // Bad Request
                const error = createError(400, validationError.message);
                const errorDetails = validationError.details.map(detail => detail.message);
                error.details = errorDetails;
                throw error;
            }
        }
    }

    const onAfter: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
        request
    ): Promise<void> => {
        if (responseSchema) {
            const { error: validationError } = responseSchema.validate(request.response, responseValidationOptions);
            if (validationError) {
                // Bad Request
                const error = createError(500, validationError.message);
                const errorDetails = validationError.details.map(detail => detail.message);
                error.details = errorDetails;
                throw error;
            }
        }
    }

    return {
        before: (eventSchema || headersSchema || pathParametersSchema) ? onBefore : undefined,
        after: responseSchema ? onAfter : undefined
    }
}

export default middleware;