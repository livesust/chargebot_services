import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { EntityAndIdPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import auditUpdate from "../shared/middlewares/audit-update";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { dateReviver } from "../shared/middlewares/json-date-parser";
import { createSuccessResponse, validateUpdateBody, validateResponse, isWarmingUp } from "../shared/rest_utils";
import { loadService } from "@chargebot-services/core/services";
import jsonBodyParser from "@middy/http-json-body-parser";
import { EventBus } from "@chargebot-services/core/services/aws/event_bus";
import { BusinessError } from "@chargebot-services/core/errors/business_error";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const id = +event.pathParameters!.id!;
  const entity_name = event.pathParameters!.entity!;
  const body = event.body;
  console.log("Call to Update", entity_name);

  await validateUpdateBody(body, entity_name);

  const service = await loadService(entity_name);

  let updated;

  try {
    updated = await service.update(id, body);
  } catch (error) {
    Log.error("Cannot update entity", { entity_name, error });
    if (error instanceof BusinessError) {
      throw createError(404, error.message, { expose: true });
    }
    const httpError = createError(406, "cannot update " + entity_name, { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }

  if (!updated?.entity) {
    Log.debug("Entity not found", { entity_name });
    throw createError(400, entity_name + " not found", { expose: true });
  }

  if (updated.event) {
    Log.debug("Dispatch updated event");
    EventBus.dispatchEvent(entity_name, "updated", updated.event);
  }

  const response = createSuccessResponse(updated.entity);

  await validateResponse(response, entity_name);

  return response;
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(validator({ pathParametersSchema: EntityAndIdPathParamSchema }))
  .use(jsonBodyParser({ reviver: dateReviver }))
  .use(auditUpdate())
  // after: inverse order execution
  .use(httpSecurityHeaders()) 
  .use(jsonBodySerializer())
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());