import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { EntityAndIdPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { loadService } from "@chargebot-services/core/services";
import { EventBus } from "@chargebot-services/core/services/aws/event_bus";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
    const id = +event.pathParameters!.id!;
    const user_id = event.requestContext?.authorizer?.jwt.claims.sub;
    const entity_name = event.pathParameters!.entity!;

    const service = await loadService(entity_name);

    let deleted;

    try {
        deleted = await service.remove(id, user_id);
    } catch (error) {
        const httpError = createError(500, "cannot remove " + entity_name, { expose: true });
        httpError.details = (<Error>error).message;
        throw httpError;
    }

    if (!deleted?.entity) {
        const error = createError(400, entity_name + " not found", { expose: true });
        throw error;
    }

    if (deleted.event) {
      EventBus.dispatchEvent(entity_name, "deleted", deleted.event);
    }

    return createSuccessResponse({ "response": "success" });
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(validator({ pathParametersSchema: EntityAndIdPathParamSchema }))
    // after: inverse order execution
    .use(jsonBodySerializer())
    // httpErrorHandler must be the last error handler attached, first to execute.
    // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
    .use(httpErrorHandler());