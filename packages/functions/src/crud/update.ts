import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { EntityAndIdPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import auditCreation from "../shared/middlewares/audit-create";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { dateReviver } from "../shared/middlewares/json-date-parser";
import { createSuccessResponse, validateUpdateBody, validateResponse, isWarmingUp } from "../shared/rest_utils";
import { loadService } from "@chargebot-services/core/services";
import jsonBodyParser from "@middy/http-json-body-parser";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
    const id = +event.pathParameters!.id!;
    const entity_name = event.pathParameters!.entity!;
    const body = event.body;

    await validateUpdateBody(body, entity_name);

    const service = await loadService(entity_name);

    let record;

    try {
        record = await service.update(id, body);
    } catch (error) {
        const httpError = createError(500, "cannot update " + entity_name, { expose: true });
        httpError.details = (<Error>error).message;
        throw httpError;
    }

    if (!record) {
        throw createError(400, entity_name + " not found", { expose: true });
    }

    const response = createSuccessResponse(record);

    await validateResponse(response, entity_name);

    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(validator({ pathParametersSchema: EntityAndIdPathParamSchema }))
    .use(jsonBodyParser({reviver: dateReviver}))
    .use(auditCreation())
    // after: inverse order execution
    .use(jsonBodySerializer())
    // httpErrorHandler must be the last error handler attached, first to execute.
    // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
    .use(httpErrorHandler());