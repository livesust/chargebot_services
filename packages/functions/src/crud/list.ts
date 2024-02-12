import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { EntityPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import { createSuccessResponse, validateArrayResponse, isWarmingUp } from "../shared/rest_utils";
import { loadService } from "@chargebot-services/core/services";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
    const entity_name = event.pathParameters!.entity!;

    const service = await loadService(entity_name);

    let records;

    try {
        records = await service.list();
    } catch (error) {
        const httpError = createError(406, "cannot list " + entity_name, { expose: true });
        httpError.details = (<Error>error).message;
        throw httpError;
    }

    const response = createSuccessResponse(records);

    await validateArrayResponse(response, entity_name);

    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(httpEventNormalizer())
    .use(validator({ pathParametersSchema: EntityPathParamSchema }))
    // after: inverse order execution
    .use(jsonBodySerializer())
    .use(httpSecurityHeaders())
    // httpErrorHandler must be the last error handler attached, first to execute.
    // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
    .use(httpErrorHandler());