import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { EntityPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { dateReviver } from "../shared/middlewares/json-date-parser";
import { createSuccessResponse, validateSearchBody, validateArrayResponse, isWarmingUp } from "../shared/rest_utils";
import { loadService } from "@chargebot-services/core/services";
import jsonBodyParser from "@middy/http-json-body-parser";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const body = event.body ?? {};
  const entity_name = event.pathParameters!.entity!;
  console.log("Call to Search", entity_name);

  await validateSearchBody(body, entity_name);

  const service = await loadService(entity_name);

  let records;

  try {
    records = await service.findByCriteria(body);
  } catch (error) {
    Log.error("Cannot search entity", { entity_name });
    const httpError = createError(406, "cannot search " + entity_name, { expose: true });
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
  .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(validator({ pathParametersSchema: EntityPathParamSchema }))
  .use(jsonBodyParser({ reviver: dateReviver }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());