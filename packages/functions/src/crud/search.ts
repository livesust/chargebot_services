import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { EntityPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { dateReviver } from "../shared/middlewares/json-date-parser";
import { createSuccessResponse, validateSearchBody, validateArrayResponse, isWarmingUp } from "../shared/rest_utils";
import { loadService } from "@chargebot-services/core/services";
import jsonBodyParser from "@middy/http-json-body-parser";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
    const body = event.body;
    const entity_name = event.pathParameters!.entity!;

    await validateSearchBody(body, entity_name);

    const service = await loadService(entity_name);

    let records;

    try {
        records = await service.findByCriteria(body);
    } catch (error) {
        const httpError = createError(500, "cannot search " + entity_name, { expose: true });
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
    .use(validator({ pathParametersSchema: EntityPathParamSchema }))
    .use(jsonBodyParser({reviver: dateReviver}))
    // after: inverse order execution
    .use(jsonBodySerializer())
    // httpErrorHandler must be the last error handler attached, first to execute.
    // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
    .use(httpErrorHandler());