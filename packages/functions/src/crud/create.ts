import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { EntityPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import auditCreation from "../shared/middlewares/audit-create";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
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
    if (error instanceof BusinessError) {
      throw createError(404, error.message, { expose: true });
    }
    throw createError(500, (<Error>error).message, { expose: true });
  }

  if (!created?.entity) {
    throw createError(400, entity_name + " not created", { expose: true });
  }

  if (created.event) {
    EventBus.dispatchEvent(entity_name, "created", created.event);
  }

  const response = createSuccessResponse(created.entity);

  await validateResponse(response, entity_name);

  return response;
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(validator({ pathParametersSchema: EntityPathParamSchema }))
  .use(jsonBodyParser({ reviver: dateReviver }))
  .use(auditCreation())
  // after: inverse order execution
  .use(jsonBodySerializer())
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());