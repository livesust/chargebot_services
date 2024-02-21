import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { EntityAndIdPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, validateResponse, isWarmingUp } from "../shared/rest_utils";
import { loadService } from "@chargebot-services/core/services";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const id = +event.pathParameters!.id!;
  const entity_name = event.pathParameters!.entity!;

  const service = await loadService(entity_name);

  let record;

  try {
    record = await service.get(id);
  } catch (error) {
    Log.error("Cannot GET entity", { entity_name });
    const httpError = createError(406, "cannot get " + entity_name, { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }

  if (!record) {
    Log.debug("Entity not found", { entity_name });
    const error = createError(400, entity_name + " not found", { expose: true });
    throw error;
  }

  const response = createSuccessResponse(record);

  await validateResponse(response, entity_name);

  return response;
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(executionTimeLogger())
  .use(httpEventNormalizer())
  .use(logTimeout())
  .use(validator({ pathParametersSchema: EntityAndIdPathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());