import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { EntityPaginatedPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { dateReviver } from "../shared/middlewares/json-date-parser";
import { createSuccessResponse, validatePaginateResponse, validateSearchBody, isWarmingUp } from "../shared/rest_utils";
import { loadService } from "@chargebot-services/core/services";
import jsonBodyParser from "@middy/http-json-body-parser";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const entity_name = event.pathParameters!.entity!;
  const page = event.pathParameters?.page ?? 0;
  const pageSize = event.pathParameters?.pageSize ?? 10;
  const sort = event.pathParameters?.sort ?? 'desc';
  const filters = event.body ?? {};

  if (filters) {
    await validateSearchBody(filters, entity_name);
  }

  const service = await loadService(entity_name);

  let records;
  let count = 0;

  try {
    [records, count] = await Promise.all([service.paginate(+page, +pageSize, sort, filters), service.count(filters)]);
  } catch (error) {
    Log.error("Cannot paginate entity", { entity_name, error });
    const httpError = createError(406, "cannot paginate " + entity_name, { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }

  const response = createSuccessResponse({
    records,
    count
  });

  await validatePaginateResponse(response, entity_name);

  return response;
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  // .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(validator({ pathParametersSchema: EntityPaginatedPathParamSchema }))
  .use(jsonBodyParser({ reviver: dateReviver }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());