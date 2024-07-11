import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import { ControlOutletSchema } from "../schemas/control_outlet.schema";
import validator from "../shared/middlewares/joi-validator";
import decrypt from "../shared/middlewares/decrypt";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { isWarmingUp } from "../shared/rest_utils";
import { BotUUIDPathParamSchema, SuccessResponseSchema } from "src/shared/schemas";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { handler as controlOutlet } from "./control_outlet";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  return controlOutlet(event);
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  // .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(decrypt())
  .use(jsonBodyParser({ reviver: dateReviver }))
  .use(validator({
    pathParametersSchema: BotUUIDPathParamSchema,
    eventSchema: ControlOutletSchema
  }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: SuccessResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());