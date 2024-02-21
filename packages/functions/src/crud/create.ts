import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { EntityPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import auditCreation from "../shared/middlewares/audit-create";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { dateReviver } from "../shared/middlewares/json-date-parser";
import { createSuccessResponse, validateCreateBody, validateResponse, isWarmingUp } from "../shared/rest_utils";
import { loadService } from "@chargebot-services/core/services";
import jsonBodyParser from "@middy/http-json-body-parser";
import { EventBus } from "@chargebot-services/core/services/aws/event_bus";
import { BusinessError } from "@chargebot-services/core/errors/business_error";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const body = event.body;
  const entity_name = event.pathParameters!.entity!;

  await validateCreateBody(body, entity_name);

  const service = await loadService(entity_name);

  let created;

  try {
    created = await service.create(body);
  } catch (error) {
    Log.error("Creation error", { error });
    if (error instanceof BusinessError) {
      throw createError(404, error.message, { expose: true });
    }
    throw createError(406, (<Error>error).message, { expose: true });
  }

  if (!created?.entity) {
    Log.warn("Entity not created", { entity_name });
    throw createError(400, entity_name + " not created", { expose: true });
  }

  if (created.event) {
    Log.debug("Dispatch creation event");
    EventBus.dispatchEvent(entity_name, "created", created.event);
  }

  const response = createSuccessResponse(created.entity);

  await validateResponse(response, entity_name);

  return response;
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(executionTimeLogger())
  .use(httpEventNormalizer())
  .use(logTimeout())
  .use(validator({ pathParametersSchema: EntityPathParamSchema }))
  .use(jsonBodyParser({ reviver: dateReviver }))
  .use(auditCreation())
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());